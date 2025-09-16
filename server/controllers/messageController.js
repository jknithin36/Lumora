// // text-based AI CHAT MESSAGE CONTROLLER

// import imagekit from "../config/imagekit.js";
// import Chat from "../models/chat.js";
// import User from "../models/user.js";
// import openai from "../config/openai.js";

// import axios from "axios";

// export const textmessageController = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     if (req.user.credits < 1) {
//       return res.json({
//         success: false,
//         message: "Your credits are not enough to generate this Feature",
//       });
//     }

//     const { chatId, prompt } = req.body;

//     const chat = await Chat.findOne({ userId, _id: chatId });

//     chat.messages.push({
//       role: "user",
//       content: prompt,
//       timestamp: Date.now(),
//       isImage: false,
//     });

//     const { choices } = await openai.chat.completions.create({
//       model: "gemini-2.0-flash",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     const reply = {
//       ...choices[0].message,
//       timestamp: Date.now(),
//       isImage: false,
//     };

//     res.json({
//       success: true,
//       reply,
//     });
//     // since it takes time we are sendig data
//     chat.messages.push(reply);

//     await chat.save();

//     await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // image generation Api

// export const imagemessageGenerator = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     if (req.user.credits < 2) {
//       return res.json({
//         success: false,
//         message: "Your credits are not enough to generate Credits",
//       });
//     }

//     const { prompt, chatId, isPublished } = req.body;

//     // find chat

//     const chat = await chat.findOne({ userId, _id: chatId });

//     // push user message

//     chat.messages.push({
//       role: "user",
//       content: prompt,
//       timestamp: Date.now(),
//       isImage: false,
//     });

//     // encde the prompt

//     const encodePrompt = encodeURIComponent(prompt);

//     // construct image gernation url

//     const generatedImageUrl = `${
//       process.env.IMAGE_KIT_URL_ENDPOINT
//     }/ik-genimg-prompt-${encodePrompt}/lumora/${Date.now()}.png?tr=w-800,h-800`;

//     // trigger generation
//     const aiImageResponse = await axios.get(generatedImageUrl, {
//       responseType: "arraybuffer",
//     });

//     //convert to base64

//     const base64Image = `data:image/png;base64,${Buffer.from(
//       aiImageResponse.data,
//       "binary"
//     ).toString("base64")}`;

//     // upload to media kit library

//     const uploadResponse = await imagekit.upload({
//       file: base64Image,
//       fileName: `${Date.now()}.png`,
//       folder: "lumora",
//     });

//     const reply = {
//       role: "assistant",
//       content: uploadResponse.url,
//       timestamp: Date.now(),
//       isImage: true,
//       isPublished,
//     };

//     res.json({ success: true, reply });

//     chat.message.push(reply);

//     await chat.save();

//     await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
// controllers/messages.js
import axios from "axios";
import imagekit from "../config/imagekit.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import openai from "../config/openai.js"; // ensure this is configured for the model you use

// --- TEXT ---
export const textmessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "Your credits are not enough to generate this Feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };

    res.json({
      success: true,
      reply,
    });
    // since it takes time we are sendig data
    chat.messages.push(reply);

    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --- IMAGE ---
export const imagemessageGenerator = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("_id credits");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    if ((user.credits ?? 0) < 2) {
      return res.status(402).json({
        success: false,
        message: "Not enough credits to generate image",
      });
    }

    const { prompt, chatId, isPublished = false } = req.body || {};
    if (!chatId || !prompt) {
      return res
        .status(400)
        .json({ success: false, message: "chatId and prompt are required" });
    }

    // find chat (use Model: Chat)
    const doc = await Chat.findOne({ _id: chatId, userId });
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });

    // push user message
    doc.messages.push({
      role: "user",
      content: prompt,
      isImage: false,
      timeStamp: new Date(),
    });

    // encode the prompt
    const encoded = encodeURIComponent(prompt);

    // construct generation URL
    const generatedImageUrl = `${
      process.env.IMAGE_KIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encoded}/lumora/${Date.now()}.png?tr=w-800,h-800`;

    // trigger generation
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // to base64
    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    // upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "lumora",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      isImage: true,
      isPublished,
      timeStamp: new Date(),
    };

    // save & bill, then respond
    doc.messages.push(reply);
    await doc.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    return res.status(200).json({ success: true, reply, chatId: doc._id });
  } catch (error) {
    console.error("imagemessageGenerator error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
          "messages.isPublished": true,
        },
      },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName", // note: your schema uses userName (not username)
          timeStamp: "$messages.timeStamp", // optional: include when it was posted
        },
      },
      { $sort: { timeStamp: -1 } }, // optional: newest first
    ]);

    res.json({ success: true, images: publishedImageMessages.reverse() });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
