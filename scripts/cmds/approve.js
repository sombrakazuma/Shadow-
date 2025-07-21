const fs = require("fs");

const approvedDataPath = "threadApproved.json";



module.exports = {

  config: {

    name: "approve",

    aliases: ["app"],

    author: "ArYAN", // don't change my credit

    countDown: 0,

    role: 2,

    category: "admin",

    shortDescription: {

      en: "Approve Unapproved Groups Chats",

    },

  },



  onLoad: async function () {

    if (!fs.existsSync(approvedDataPath)) {

      fs.writeFileSync(approvedDataPath, JSON.stringify([]));

    }

  },



  onStart: async function ({ event, api, args }) {

    const { threadID, messageID, senderID } = event;

    const command = args[0] || "";

    const idToApprove = args[1] || threadID;

    const customMessage = args.slice(2).join(" ");

    const adminID = "61556172651835";

    let approvedData = JSON.parse(fs.readFileSync(approvedDataPath));



    switch (command) {

      case "list":

        let msg = "✅ 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽𝘀\n━━━━━━━━━━\n\nVoici la liste des groupes approuvés\n";

        for (let index = 0; index < approvedData.length; index++) {

          const groupId = approvedData[index];

          const threadInfo = await api.getThreadInfo(groupId);

          const groupName = threadInfo ? (threadInfo.name || "Unnamed Group") : "Unnamed Group";

          msg += `━━━━━━━[ ${index + 1} ]━━━━━━━\nℹ𝙉𝙖𝙢𝙚➤ ${groupName}\n🆔 𝙄𝘿➤ ${groupId}\n`;

        }

        api.sendMessage(msg, threadID, messageID);

        break;



      case "del":

        if (!isNumeric(idToApprove)) {

          api.sendMessage("⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝙡 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\n𝗡𝘂𝗺𝗲́𝗿𝗼 𝗼𝘂 𝗧𝗜𝗗 𝗶𝗻𝘃𝗮𝗹𝗶𝗱𝗲, 𝘃𝗲𝘂𝗶𝗹𝗹𝗲𝘇 𝘃𝗲́𝗿𝗶𝗳𝗶𝗲𝗿 𝘃𝗼𝘁𝗿𝗲 𝗻𝘂𝗺𝗲́𝗿𝗼 𝗱𝗲 𝗴𝗿𝗼𝘂𝗽𝗲.", threadID, messageID);

          return;

        }



        if (!approvedData.includes(idToApprove)) {

          api.sendMessage("⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nLe groupe n'a pas été approuvé auparavant!", threadID, messageID);

          return;

        }



        approvedData = approvedData.filter((e) => e !== idToApprove);

        fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));



        const threadInfoDel = await api.getThreadInfo(idToApprove);

        const groupNameDel = threadInfoDel.name || "Unnamed Group";



        api.sendMessage(`⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nLe groupe a été retiré de la liste d'approbation. \nℹ️ | Group: ${groupNameDel}\n🆔 | TID: ${idToApprove}`, threadID, messageID);

        break;



      case "batch":

        const idsToApprove = args.slice(1);

        let batchMessage = "⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nGroupes approuvés:\n";

        for (const id of idsToApprove) {

          if (isNumeric(id) && !approvedData.includes(id)) {

            approvedData.push(id);

            const threadInfoBatch = await api.getThreadInfo(id);

            const groupNameBatch = threadInfoBatch.name || "Unnamed Group";

            batchMessage += `ℹ️ | Groupe : ${groupNameBatch}\n🆔 | TID: ${id}\n`;

          }

        }

        fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

        api.sendMessage(batchMessage, threadID, messageID);

        break;



      case "search":

        const searchTerm = args.slice(1).join(" ");

        let searchMsg = `⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nRésultats de recherche pour "${searchTerm}":\n`;

        for (let index = 0; index < approvedData.length; index++) {

          const groupId = approvedData[index];

          const threadInfoSearch = await api.getThreadInfo(groupId);

          const groupNameSearch = threadInfoSearch ? (threadInfoSearch.name || "Unnamed Group") : "Unnamed Group";

          if (groupNameSearch.includes(searchTerm) || groupId.includes(searchTerm)) {

            searchMsg += `━━━━━━━[ ${index + 1} ]━━━━━━━\nℹ𝗡𝗮𝗺𝗲➤ ${groupNameSearch}\n🆔 𝗜𝗗➤ ${groupId}\n`;

          }

        }

        api.sendMessage(searchMsg, threadID, messageID);

        break;



      default:

        if (!isNumeric(idToApprove)) {

          api.sendMessage("⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\UID de groupe invalide, veuillez vérifier votre UID de groupe", threadID, messageID);

        } else if (approvedData.includes(idToApprove)) {

          const threadInfo = await api.getThreadInfo(idToApprove);

          const groupName = threadInfo.name || "Unnamed Group";

          api.sendMessage(`⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nℹ️ Groupe: ${groupName} | TID: ${idToApprove} was already approved!`, threadID, messageID);

        } else {

          // Approve the group

          approvedData.push(idToApprove);

          fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));



          // Send approval message to the group

          const userInfo = await api.getUserInfo(senderID);

          const userName = userInfo[senderID].name;

          const userID = event.senderID;

          const threadInfo = await api.getThreadInfo(idToApprove);

          const groupName = threadInfo.name || "Unnamed Group";

          const userFbLink = `https://www.facebook.com/${userID}`;

          const approvalTime = new Date().toLocaleTimeString();

          const approvalDate = new Date().toLocaleDateString();

          const approvalCount = approvedData.length;



          const approvalMessage = `⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nVotre groupe a été approuvé par ${userName}\n🔎 𝗔𝗰𝘁𝗶𝗼𝗻 𝗜𝗗 ${userID}\n🖇 𝗙𝗕 𝗟𝗶𝗻𝗸: ${userFbLink}\n🗓 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗧𝗶𝗺𝗲: ${approvalTime}/${approvalDate}\n\nℹ 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗗𝗮𝘁𝗮: ${approvalCount}\n${customMessage}`;



          api.sendMessage(approvalMessage, idToApprove);



          api.sendMessage(`⚙ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗦𝘆𝘀𝘁𝗲𝗺\n━━━━━━━━━━\n\nLe groupe a été approuvé avec succès:\nℹ️ | Groupe : ${groupName}\n🆔 | TID: ${idToApprove}`, threadID, messageID);



          // Optional Admin Notification

          const adminNotificationEnabled = true; // Toggle this to enable/disable admin notification

          if (adminNotificationEnabled) {

            api.sendMessage(approvalMessage, adminID);

          }

        }

        break;

    }

  },

};



function isNumeric(value) {

  return /^-?\d+$/.test(value);

  }
