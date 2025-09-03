import nodemailer from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '../config/env.js';

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// // otp mail
// export const sendIDEmail = async (email, fullName, staffID, role) => {
//   try {
//     const info = await transporter.sendMail({
//       from: SMTP_USER,
//       to: email,
//       subject: "👋 Welcome to Suku Technologies – Your ID is Here!",
//       text: `Hello ${fullName}, welcome to Suku Technologies!

// Your Check-In/Check-Out ID is: ${staffID}
// Role: ${role}

// Use this ID to check in and out whenever you arrive at or leave the workplace.

// If you did not sign up with us, please ignore this email.`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background: #f0f4f7 url('https://ik.imagekit.io/w8cwibjr9/about-images-sq.png'); background-repeat: repeat; background-size: cover; padding: 20px; text-align: center;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: rgba(255, 255, 255, 0.9); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

//             <div style="background-color: #032040; padding: 40px 20px;">
//               <img src="https://i.imgur.com/lLJeIyu.png" alt="Suku Technologies Logo" style="max-width: 200px; display: block; margin: 0 auto;">
//             </div>

//             <div style="padding: 24px; color: #333; line-height: 1.6;">
//               <h2 style="color: #2d7ff9; margin-top: 0;">👋 Welcome to Suku Technologies, <strong>${fullName}</strong>!</h2>

//               <p style="font-size: 16px;">We're thrilled to have you join our team as a <strong>${role}</strong>.</p>

//               <p style="font-size: 16px;">🔑 Your Check-In/Check-Out ID:</p>
//               <p style="font-size: 28px; font-weight: bold; color: #2d7ff9; margin: 10px 0;"><strong>${staffID}</strong></p>

//               <p style="font-size: 16px;">
//                 Please use this unique ID to Check In and Check Out whenever you arrive at or leave the office.
//               </p>
//             </div>

//             <div style="background-color: #f0f4f7; color: #888; font-size: 12px; padding: 20px; border-top: 1px solid #e1e1e1;">
//               <p style="margin: 0 0 5px;">Suku Technologies</p>
//               <p style="margin: 0 0 5px;">21 King Tackie Ave, Hilla Limann Hwy, Accra</p>
//               <p style="margin: 0;">
//                 <a href="https://sukutechnologies.com/" style="color: #2d7ff9; text-decoration: none;">sukutechnologies.com</a>
//               </p>
//             </div>

//             <div style="padding: 10px 20px; background-color: #032040; color: #fff; font-size: 10px; text-align: center;">
//               <p style="margin: 0;">If you did not register with us, please ignore this email.</p>
//             </div>

//           </div>
//         </div>
//       `,
//     });

//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error("❌ Error while sending welcome email", error);
//   }
// };

export const sendIDEmail = async (email, fullName, staffID, role) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: email,
      subject: "👋 Welcome to Suku Technologies – Your ID is Here!",
      text: `Hello ${fullName}, welcome to Suku Technologies!

Your Check-In/Check-Out ID is: ${staffID}
Role: ${role}

Use this ID to check in and out whenever you arrive at or leave the workplace.

If you did not sign up with us, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f0f4f7; padding: 20px; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
            <div style="background-color: #032040; padding: 40px 20px;">
              <img src="https://ik.imagekit.io/w8cwibjr9/WhatsApp_Image_2025-09-03_at_10.14.43_53cd1085-removebg-preview.png" alt="Suku Technologies Logo" style="max-width: 200px; display: block; margin: 0 auto;"/>
            </div>

            <!-- This is the container for the background image -->
            <div style="padding: 24px; line-height: 1.6; background-image: url('https://ik.imagekit.io/w8cwibjr9/Background1.jpg'); background-size: cover; background-repeat: no-repeat; background-position: center; background-color: #f0f4f7;">
              <!-- This is the semi-transparent layer to make the text readable -->
              <div style="background-color: rgba(255, 255, 255, 0.7); padding: 10px;">
                <h2 style="color: #2d7ff9; margin-top: 0;">👋 Welcome to Suku Technologies, <strong>${fullName}</strong>!</h2>

                <p style="font-size: 16px; color: #333;">We're thrilled to have you join our team as a <strong>${role}</strong>.</p>

                <p style="font-size: 16px; color: #333;">🔑 Your Check-In/Check-Out ID:</p>
                <p style="font-size: 28px; font-weight: bold; color: #2d7ff9; margin: 10px 0;"><strong>${staffID}</strong></p>

                <p style="font-size: 16px; color: #333;">
                  Please use this unique ID to Check In and Check Out whenever you arrive at or leave the office.
                </p>
              </div>
            </div>

            <div style="background-color: #f0f4f7; color: #888; font-size: 12px; padding: 20px; border-top: 1px solid #e1e1e1;">
              <p style="margin: 0 0 5px;">Suku Technologies</p>
              <p style="margin: 0 0 5px;">21 King Tackie Ave, Hilla Limann Hwy, Accra</p>
              <p style="margin: 0;">
                <a href="https://client1.sukutechnologies.com/" style="color: #2d7ff9; text-decoration: none;">sukutechnologies.com</a>
              </p>
            </div>

            <div style="padding: 10px 20px; background-color: #032040; color: #fff; font-size: 10px; text-align: center;">
              <p style="margin: 0;">If you did not register with us, please ignore this email.</p>
            </div>

          </div>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error while sending welcome email", error);
  }
};

// export const sendIDEmail = async (email, fullName, staffID, role) => {
//   try {
//     const info = await transporter.sendMail({
//       from: SMTP_USER,
//       to: email,
//       subject: "👋 Welcome to Suku Technologies – Your ID is Here!",
//       text: `Hello ${fullName}, welcome to Suku Technologies!

// Your Check-In/Check-Out ID is: ${staffID}
// Role: ${role}

// Use this ID to check in and out whenever you arrive at or leave the workplace.

// If you did not sign up with us, please ignore this email.`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f0f4f7; padding: 20px; text-align: center;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
//             <div style="background-color: #032040; padding: 40px 20px;">
//               <img src="https://i.imgur.com/lLJeIyu.png" alt="Suku Technologies Logo" style="max-width: 200px; display: block; margin: 0 auto;"/>
//             </div>

//             <div style="padding: 24px; color: #333; line-height: 1.6; background: #f0f4f7 url('https://ik.imagekit.io/w8cwibjr9/about-images-sq.png'); background-size: cover; background-repeat: no-repeat; background-position: center;">
//               <h2 style="color: #2d7ff9; margin-top: 0;">👋 Welcome to Suku Technologies, <strong>${fullName}</strong>!</h2>

//               <p style="font-size: 16px;">We're thrilled to have you join our team as a <strong>${role}</strong>.</p>

//               <p style="font-size: 16px;">🔑 Your Check-In/Check-Out ID:</p>
//               <p style="font-size: 28px; font-weight: bold; color: #2d7ff9; margin: 10px 0;"><strong>${staffID}</strong></p>

//               <p style="font-size: 16px;">
//                 Please use this unique ID to Check In and Check Out whenever you arrive at or leave the office.
//               </p>
//             </div>

//             <div style="background-color: #f0f4f7; color: #888; font-size: 12px; padding: 20px; border-top: 1px solid #e1e1e1;">
//               <p style="margin: 0 0 5px;">Suku Technologies</p>
//               <p style="margin: 0 0 5px;">21 King Tackie Ave, Hilla Limann Hwy, Accra</p>
//               <p style="margin: 0;">
//                 <a href="https://sukutechnologies.com/" style="color: #2d7ff9; text-decoration: none;">sukutechnologies.com</a>
//               </p>
//             </div>

//             <div style="padding: 10px 20px; background-color: #032040; color: #fff; font-size: 10px; text-align: center;">
//               <p style="margin: 0;">If you did not register with us, please ignore this email.</p>
//             </div>

//           </div>
//         </div>
//       `,
//     });

//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error("❌ Error while sending welcome email", error);
//   }
// };

// export const sendIDEmail = async (email, fullName, staffID, role) => {
//   try {
//     const info = await transporter.sendMail({
//       from: SMTP_USER,
//       to: email,
//       subject: "👋 Welcome to Suku Technologies – Your ID is Here!",
//       text: `Hello ${fullName}, welcome to Suku Technologies!

// Your Check-In/Check-Out ID is: ${staffID}
// Role: ${role}

// Use this ID to check in and out whenever you arrive at or leave the workplace.

// If you did not sign up with us, please ignore this email.`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background-color: #f0f4f7; padding: 20px; text-align: center;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            
//             <div style="background-color: #032040; padding: 40px 20px;">
//               <img src="https://ik.imagekit.io/w8cwibjr9/suku-logo.jpg" alt="Suku Technologies Logo" style="max-width: 200px; display: block; margin: 0 auto;"/>
//             </div>

//             <!--[if gte mso 9]>
//             <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
//               <v:fill type="tile" src="https://ik.imagekit.io/w8cwibjr9/about-images-sq.png" color="#f0f4f7" />
//               <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
//             <![endif]-->
//             <div style="padding: 24px; line-height: 1.6; background-image: url('https://ik.imagekit.io/w8cwibjr9/about-images-sq.png'); background-size: cover; background-repeat: no-repeat; background-position: center; background-color: #f0f4f7;">
//                 <div style="background-color: rgba(255, 255, 255, 0.7); padding: 10px;">
//                   <h2 style="color: #2d7ff9; margin-top: 0;">👋 Welcome to Suku Technologies, <strong>${fullName}</strong>!</h2>

//                   <p style="font-size: 16px; color: #333;">We're thrilled to have you join our team as a <strong>${role}</strong>.</p>

//                   <p style="font-size: 16px; color: #333;">🔑 Your Check-In/Check-Out ID:</p>
//                   <p style="font-size: 28px; font-weight: bold; color: #2d7ff9; margin: 10px 0;"><strong>${staffID}</strong></p>

//                   <p style="font-size: 16px; color: #333;">
//                     Please use this unique ID to Check In and Check Out whenever you arrive at or leave the office.
//                   </p>
//                 </div>
//             </div>
//             <!--[if gte mso 9]>
//               </v:textbox>
//             </v:rect>
//             <![endif]-->

//             <div style="background-color: #f0f4f7; color: #888; font-size: 12px; padding: 20px; border-top: 1px solid #e1e1e1;">
//               <p style="margin: 0 0 5px;">Suku Technologies</p>
//               <p style="margin: 0 0 5px;">21 King Tackie Ave, Hilla Limann Hwy, Accra</p>
//               <p style="margin: 0;">
//                 <a href="https://sukutechnologies.com/" style="color: #2d7ff9; text-decoration: none;">sukutechnologies.com</a>
//               </p>
//             </div>

//             <div style="padding: 10px 20px; background-color: #032040; color: #fff; font-size: 10px; text-align: center;">
//               <p style="margin: 0;">If you did not register with us, please ignore this email.</p>
//             </div>

//           </div>
//         </div>
//       `,
//     });

//     console.log("Message sent: %s", info.messageId);
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error("❌ Error while sending welcome email", error);
//   }
// };