const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cron = require("node-cron");

const mongoose = require("mongoose"); 



const EmailsSentSchema = require("../models/NodeMailerModel")
const Reserved = require("../models/HistoryModel");
const moment = require("moment"); // For date comparison
dotenv.config();




async function getAllReserved(req, res) {
  try {
      const allReserved = await Reserved.find().populate("items.bookId").populate("userId", "-password");

      if (!allReserved) {
          return { noReservedFound: "Reserved not found" };
      }

      return allReserved;
  } 
  
  catch (error) {
      console.error(error);
  }
}



// Modified checkReserved function to find overdue reservations
const checkReserved = async () => {
  try {
    // Current date in UTC
    const currentDate = moment.utc().format("YYYY-MM-DD");
    
    // Fetch all reserved books
    const allReserve = await getAllReserved();

    if (!Array.isArray(allReserve) || allReserve.length === 0) {
      return { message: "No reserved books found" };
    }

    // Filter items where willUseBy is before today (i.e. overdue)
    const matchingReservations = allReserve.map((reservation) => {
      const matchingItems = reservation.items.filter(
        (item) => moment.utc(item.willUseBy).isBefore(moment.utc(), 'day')
      );

      return {
        userId: reservation.userId._id,
        userName: reservation.userId.name,
        userEmail: reservation.userId.email,
        matchingItems,
      };
    }).filter((res) => res.matchingItems.length > 0);

    if (matchingReservations.length > 0) {
      return {
        message: "Overdue reservations found",
        reservations: matchingReservations,
      };
    } else {
      return { NoReservations: "No overdue reservations found for today" };
    }
  } catch (error) {
    console.error("Error while checking reservations:", error);
    throw error;
  }
};

// Modified sendEmail function with updated email content
const sendEmail = async (req, res) => {
  try {
    // Fetch overdue reservations from checkReserved function
    const reservationsResponse = await checkReserved();
    const reservations = reservationsResponse.reservations;

    if (!reservations || reservations.length === 0) {
      return { noReservations: "No overdue reservations found for today." };
    }

    if (!reservationsResponse || !reservationsResponse.reservations) {
      return { error: "Failed to retrieve reservations." };
    }

    const config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);
    const currentDateStart = moment.utc().startOf("day").toDate();

    for (const reservation of reservations) {
      const { userEmail, userId, userName, matchingItems } = reservation;

      // Find existing email history for the user on the current day
      const existingRecord = await EmailsSentSchema.findOne({
        userId,
        "items.createdDate": { $gte: currentDateStart, $lt: moment.utc().endOf("day").toDate() },
      });

      let newBookIds = [];
      if (existingRecord) {
        // Get already sent book IDs
        const existingBookIds = existingRecord.items.map((item) => item.bookId.toString());
        newBookIds = matchingItems
          .map((item) => item.bookId._id.toString())
          .filter((bookId) => !existingBookIds.includes(bookId));
      } else {
        newBookIds = matchingItems.map((item) => item.bookId._id.toString());
      }

      if (newBookIds.length > 0) {
        // Build the overdue email content
        const mailContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Overdue Books Notice</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; }
              .container { background-color: #ffffff; border-radius: 5px; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
              h1 { color: #333; }
              p { color: #666; }
              ul { list-style: none; padding: 0; }
              li { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Overdue Books Notice</h1>
              <p>Dear ${userName},</p>
              <p>The following book(s) are overdue (they were due on the listed date) and may incur a fine:</p>
              <ul>
                ${matchingItems
                  .filter((item) => newBookIds.includes(item.bookId._id.toString()))
                  .map((item) => `<li>${item.bookId.bookName} - Due on ${moment.utc(item.willUseBy).format("YYYY-MM-DD")}</li>`)
                  .join("")}
              </ul>
              <p>Please return the overdue items as soon as possible to avoid additional fines.</p>
            </div>
          </body>
          </html>
        `;

        const message = {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: "Overdue Books Notice",
          html: mailContent,
        };

        // Send the email
        await transporter.sendMail(message);

        // Update or create the email history record
        if (existingRecord) {
          newBookIds.forEach((bookId) => {
            existingRecord.items.push({
              bookId,
              createdDate: currentDateStart,
            });
          });
          await existingRecord.save();
        } else {
          const newRecord = new EmailsSentSchema({
            userId,
            items: newBookIds.map((bookId) => ({
              bookId,
              createdDate: currentDateStart,
            })),
          });
          await newRecord.save();
        }
      }
    }

    return { message: "Overdue email notifications sent successfully." };
  } catch (error) {
    console.error("Error sending emails:", error);
    return res.status(500).json({ error: "An error occurred while sending emails." });
  }
};





cron.schedule("10 * * * * *", async () => {
  try {

    const res = await sendEmail()

    if(res)
    {
      console.log(res)
      return
    } 

    console.log("If any Emails are there to send I have sent those emails.");

  } 
  
  catch(error) {
    console.log("Error while sending emails in cron job:", error);
  }
});


 


const emailsSentHistory = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: "userId and bookId are required." });
    }

    // Define the current day's boundary
    const currentDateStart = moment.utc().startOf("day").toDate();
    const currentDateEnd = moment.utc().endOf("day").toDate();

    // Find the record for the current day and check if the bookId already exists in the items array
    const existingRecord = await EmailsSentSchema.findOne({
      userId,
      "items.createdDate": { $gte: currentDateStart, $lt: currentDateEnd },
    });

    if (existingRecord) {
      const bookAlreadyExists = existingRecord.items.some(
        (item) => item.bookId.toString() === bookId
      );

      if (bookAlreadyExists) {
        return res.status(409).json({
          error: "An email for this bookId and userId has already been sent today.",
        });
      }

      // If not a duplicate, add the new bookId to the items array
      existingRecord.items.push({ bookId, createdDate: currentDateStart });

      await existingRecord.save();

      return res.status(200).json({
        message: "Email record updated successfully.",
        existingRecord,
      });
    } else {
      // If no record exists for the current date, create a new one
      const newRecord = new EmailsSentSchema({
        userId,
        items: [{ bookId, createdDate: currentDateStart }],
      });

      await newRecord.save();

      return res.status(201).json({
        message: "Email record created successfully.",
        newRecord,
      });
    }
  } catch (error) {
    console.error("Error while updating/creating email record:", error);
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
};

  




    const getEmailsHistory = async (req, res) => {
        try {
          // Get the current date in UTC
          const currentDate = moment.utc().format("YYYY-MM-DD");
          const startOfDay = moment.utc(currentDate).startOf("day").toDate();
          const endOfDay = moment.utc(currentDate).endOf("day").toDate();
      
          // Retrieve all email records that contain at least one item with a matching createdDate
          const emailHistory = await EmailsSentSchema.find({
            "items.createdDate": { $gte: startOfDay, $lt: endOfDay },
          });
      
          if (emailHistory.length === 0) {
            return res.status(404).json({ message: "No email history found for today." });
          }
      
          // Filter the items within each record to include only those with a createdDate that matches the current date
          const filteredEmailHistory = emailHistory.map((record) => {
            const matchingItems = record.items.filter(
              (item) => moment.utc(item.createdDate).format("YYYY-MM-DD") === currentDate
            );
      
            return {
              ...record.toObject(),
              items: matchingItems,
            };
          });
      
          // If all records have no matching items, return 404
          const allItemsEmpty = filteredEmailHistory.every((record) => record.items.length === 0);
          if (allItemsEmpty) {
            return res.status(404).json({ message: "No email history found for today." });
          }
      
          return res.status(200).json({
            message: "Email history retrieved successfully.",
            data: filteredEmailHistory,
          });
        } catch (error) {
          console.error("Error fetching email history:", error);
          return res.status(500).json({ error: "An error occurred while fetching email history." });
        }
      };
      
      

      
           




module.exports = {
  checkReserved,
  sendEmail,
  emailsSentHistory,
  getEmailsHistory
};
