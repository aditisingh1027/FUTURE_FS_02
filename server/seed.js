const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Activity = require('./models/Activity');

dotenv.config();

const SEED_USER_EMAIL = 'aditi@example.com';
const SEED_USER_NAME = 'Aditi Kumari Singh';
const SEED_USER_PASSWORD = 'Aditi@1204';
const SEED_USER_ROLE = 'admin';

const leadSamples = [
  {
    name: 'Ethan Cole',
    email: 'ethan.cole@horizonsystems.io',
    phone: '+1 415-555-0142',
    source: 'website',
    status: 'new',
    notes: [{ content: 'Visited the enterprise pricing page and requested a starter package estimate.' }],
    followUpOffset: 2,
  },
  {
    name: 'Mina Patel',
    email: 'mina.patel@oakridgeconsulting.com',
    phone: '+1 312-555-0193',
    source: 'email',
    status: 'contacted',
    notes: [{ content: 'Sent introduction email and requested feedback on the proposed workflow.' }],
    followUpOffset: 3,
  },
  {
    name: 'Diego Alvarez',
    email: 'diego.alvarez@meridianfinance.com',
    phone: '+1 646-555-0112',
    source: 'referral',
    status: 'qualified',
    notes: [{ content: 'Referred by a current customer; finance team wants integration with existing ERP.' }],
    followUpOffset: 5,
  },
  {
    name: 'Hannah Lee',
    email: 'hannah.lee@apexsecurity.com',
    phone: '+1 703-555-0147',
    source: 'cold_call',
    status: 'new',
    notes: [{ content: 'Cold outreach accepted; wants a brief demo for the security operations team.' }],
    followUpOffset: 1,
  },
  {
    name: 'Noelle Brooks',
    email: 'noelle.brooks@solstice.design',
    phone: '+1 773-555-0115',
    source: 'referral',
    status: 'won',
    notes: [{ content: 'Closed deal after design team approved the value proposition.' }],
    followUpOffset: -1,
  },
  {
    name: 'Liam Chan',
    email: 'liam.chan@pulseanalytics.com',
    phone: '+1 818-555-0144',
    source: 'website',
    status: 'contacted',
    notes: [{ content: 'Downloaded the ROI calculator and asked for a follow-up call next week.' }],
    followUpOffset: 4,
  },
  {
    name: 'Zara Morgan',
    email: 'zara.morgan@latticetalent.com',
    phone: '+1 650-555-0178',
    source: 'social_media',
    status: 'qualified',
    notes: [{ content: 'Hiring team liked the workflow demo and is evaluating rollout plans.' }],
    followUpOffset: 7,
  },
  {
    name: 'Julian Park',
    email: 'julian.park@evergreen.agency',
    phone: '+1 510-555-0139',
    source: 'email',
    status: 'new',
    notes: [{ content: 'Inquired about marketing automation and requested a vendor comparison.' }],
    followUpOffset: 6,
  },
  {
    name: 'Talia Jenkins',
    email: 'talia.jenkins@keystoneenergy.com',
    phone: '+1 215-555-0140',
    source: 'referral',
    status: 'contacted',
    notes: [{ content: 'Referral from industry partner; energy team wants a proof-of-concept.' }],
    followUpOffset: 2,
  },
  {
    name: 'Noah Bennett',
    email: 'noah.bennett@canvasstudio.com',
    phone: '+1 917-555-0161',
    source: 'cold_call',
    status: 'qualified',
    notes: [{ content: 'Approved by operations after reviewing integration requirements.' }],
    followUpOffset: 5,
  },
  {
    name: 'Sofia Duarte',
    email: 'sofia.duarte@beaconanalytics.io',
    phone: '+1 415-555-0180',
    source: 'website',
    status: 'new',
    notes: [{ content: 'Signed up for the newsletter and requested reference case studies.' }],
    followUpOffset: 8,
  },
  {
    name: 'Ari Morgan',
    email: 'ari.morgan@coastalventures.com',
    phone: '+1 703-555-0159',
    source: 'social_media',
    status: 'qualified',
    notes: [{ content: 'Interested in sales automation; asked for a detailed follow-up proposal.' }],
    followUpOffset: 3,
  },
  {
    name: 'Camila Rivera',
    email: 'camila.rivera@studioelevate.com',
    phone: '+1 212-555-0185',
    source: 'email',
    status: 'won',
    notes: [{ content: 'Signed contract and is onboarding the SaaS team this quarter.' }],
    followUpOffset: -2,
  },
  {
    name: 'Evan Schultz',
    email: 'evan.schultz@stellarlogistics.com',
    phone: '+1 832-555-0136',
    source: 'cold_call',
    status: 'contacted',
    notes: [{ content: 'Scheduling an operations review with the logistics director.' }],
    followUpOffset: 3,
  },
  {
    name: 'Priya Menon',
    email: 'priya.menon@horizonhealthcare.com',
    phone: '+1 303-555-0194',
    source: 'referral',
    status: 'new',
    notes: [{ content: 'Client referral from the healthcare team; interested in compliance features.' }],
    followUpOffset: 7,
  },
  {
    name: 'Omar Farouk',
    email: 'omar.farouk@atlashospitality.com',
    phone: '+1 305-555-0118',
    source: 'website',
    status: 'contacted',
    notes: [{ content: 'Requested an executive briefing on customer success metrics.' }],
    followUpOffset: 4,
  },
  {
    name: 'Maya Singh',
    email: 'maya.singh@montagecreatives.com',
    phone: '+1 415-555-0127',
    source: 'social_media',
    status: 'qualified',
    notes: [{ content: 'Ready for budget approval after reviewing the proposal.' }],
    followUpOffset: 1,
  },
  {
    name: 'Lucas Reed',
    email: 'lucas.reed@talentbridge.net',
    phone: '+1 214-555-0168',
    source: 'email',
    status: 'won',
    notes: [{ content: 'Converted after the HR team confirmed the onboarding timeline.' }],
    followUpOffset: -4,
  },
  {
    name: 'Aisha Karim',
    email: 'aisha.karim@novaevents.co',
    phone: '+1 646-555-0191',
    source: 'cold_call',
    status: 'new',
    notes: [{ content: 'Inquired about event scheduling automation for their next campaign.' }],
    followUpOffset: 5,
  },
];

const getRelativeDate = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString();
};

const runSeed = async () => {
  await connectDB();

  let user = await User.findOne({ email: SEED_USER_EMAIL });
  if (!user) {
    user = await User.create({
      name: SEED_USER_NAME,
      email: SEED_USER_EMAIL,
      password: SEED_USER_PASSWORD,
      role: SEED_USER_ROLE,
    });
  } else {
    const needsUpdate = user.name !== SEED_USER_NAME || user.role !== SEED_USER_ROLE;
    if (needsUpdate) {
      user.name = SEED_USER_NAME;
      user.role = SEED_USER_ROLE;
      await user.save();
    }
  }

  const existingLeadEmails = leadSamples.map((lead) => lead.email);
  const existingLeads = await Lead.find({ email: { $in: existingLeadEmails } });
  const existingEmails = existingLeads.map((lead) => lead.email);

  const leadsToCreate = leadSamples.filter((lead) => !existingEmails.includes(lead.email));

  if (!leadsToCreate.length) {
    console.log('Seed data already exists. Skipping creation.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const createdLeads = [];

  for (const leadSample of leadsToCreate) {
    const lead = await Lead.create({
      name: leadSample.name,
      email: leadSample.email,
      phone: leadSample.phone,
      source: leadSample.source,
      status: leadSample.status,
      notes: leadSample.notes,
      followUpDate: getRelativeDate(leadSample.followUpOffset),
      assignedTo: user._id,
    });

    createdLeads.push(lead);

    await Activity.create({
      lead: lead._id,
      performedBy: user._id,
      type: 'creation',
      description: `Added lead via seed script from ${leadSample.source}`,
    });

    for (const note of leadSample.notes) {
      await Activity.create({
        lead: lead._id,
        performedBy: user._id,
        type: 'note',
        description: note.content,
      });
    }
  }

  console.log(`Created ${createdLeads.length} new seed leads and activity entries.`);
  await mongoose.disconnect();
  process.exit(0);
};

const clearSeed = async () => {
  await connectDB();

  const user = await User.findOne({ email: SEED_USER_EMAIL });
  if (!user) {
    console.log('No seed user found. Nothing to clear.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const seededLeads = await Lead.find({ assignedTo: user._id });
  const leadIds = seededLeads.map((lead) => lead._id);

  await Activity.deleteMany({ lead: { $in: leadIds } });
  await Lead.deleteMany({ assignedTo: user._id });
  await User.deleteOne({ _id: user._id });

  console.log(`Removed ${seededLeads.length} seeded leads and related activity entries.`);
  await mongoose.disconnect();
  process.exit(0);
};

const main = async () => {
  const isClear = process.argv.includes('--clear') || process.argv.includes('-c');
  if (isClear) {
    await clearSeed();
  } else {
    await runSeed();
  }
};

main().catch((error) => {
  console.error(error);
  mongoose.disconnect().finally(() => process.exit(1));
});