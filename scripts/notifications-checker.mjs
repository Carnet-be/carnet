// scripts/check-for-expired-auctions.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { addDoc, collection, Timestamp } from "firebase/firestore";

import { getApp, getApps, initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEN8KCXXbM_UUiU8dGBD1f-br2y0JS70I",
  projectId: "carnet-371611",
  appId: "1:1009587678596:web:d16c07c8601cefeb9f01d1",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

let logged3h = [];
let logged1h = [];
let loggedExpired = [];
async function checkForExpiredAuctions() {
  const now = new Date();
  const tenMinutesAgo = new Date(now - 10 * 60 * 1000);
  const threeHoursFromNow = new Date(now + 3 * 60 * 60 * 1000);
  const auctions = await prisma.auction.findMany({
    where: {
      state: "published",
      isClosed: false,
      OR: [
        { end_date: { gte: tenMinutesAgo, lt: now } }, // Expired in the last 10 minutes
        {
          end_date: { gte: now, lt: new Date(now.getTime() + 60 * 60 * 1000) },
        }, // Expires in the next hour
        {
          end_date: {
            gte: now,
            lt: new Date(now.getTime() + 3 * 60 * 60 * 1000),
          },
        }, // Expires in the next 3 hours
      ],
    },
    select: {
      id: true,
      end_date: true,
      auctionnaire_id: true,
      name: true,
      bids: {
        select: {
          bidder_id: true,
        },
      },
    },
  });
  console.clear();
  console.log("loggedExpired", loggedExpired.length);
  console.log("logged1h", logged1h.length);
  console.log("logged3h", logged3h.length);
  console.log("----------");
  console.log("auctions.length", auctions.length);
  console.log("----------");
  auctions.forEach(async (auction) => {
    // if (!logged3h.includes(auction.id) && !logged1h.includes(auction.id) && !loggedExpired.includes(auction.id)) {
    if (auction.end_date < now) {
      if (!loggedExpired.includes(auction.id)) {
        console.log(`Auction ${auction.id} expired`);

        await sendNotif(auction, "auction expired");
        loggedExpired.push(auction.id);
      }
    } else if (auction.end_date < new Date(now.getTime() + 60 * 60 * 1000)) {
      if (!logged1h.includes(auction.id)) {
        console.log(`Auction ${auction.id} expires in the next hour`);
        await sendNotif(auction, "auction 1h left");
        logged1h.push(auction.id);
      }
    } else if (
      auction.end_date < new Date(now.getTime() + 3 * 60 * 60 * 1000)
    ) {
      if (!logged3h.includes(auction.id)) {
        console.log(`Auction ${auction.id} expires in the next 3 hours`);
        await sendNotif(auction, "auction 3h left");
        logged3h.push(auction.id);
      }
    }
    // }
  });
}

async function sendNotif(auction, type) {
  await addDoc(collection(db, "notifications"), {
    type,
    auction_id: auction.id,
    auctionnaire_id: auction.auctionnaire_id,
    auction_name: auction.name,
    bidders: [...new Set(auction.bids.map((bid) => bid.bidder_id))],
    date: Timestamp.fromDate(new Date()),
    hasRead: [],
  });
}

function run() {
  checkForExpiredAuctions().finally(() => {
    prisma.$disconnect();
  });
}

// Run the function initially
run();

// Schedule the function to run every 5 minutes
setInterval(() => {
  run();
}, 5 * 1000); // 5 minutes in milliseconds
