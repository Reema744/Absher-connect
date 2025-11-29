import { db } from "./db";
import { 
  users, passports, nationalIds, drivingLicenses, 
  violations, appointments, delegations, hajjStatus 
} from "@shared/schema";

const arabicFirstNames = [
  "Mohammed", "Ahmed", "Abdullah", "Omar", "Ali", "Khalid", "Fahad", "Sultan",
  "Saad", "Nasser", "Turki", "Faisal", "Saleh", "Ibrahim", "Hassan", "Hussain",
  "Youssef", "Majed", "Nawaf", "Hamad", "Saud", "Mansour", "Waleed", "Bandar",
  "Rakan", "Tariq", "Zaid", "Yazid", "Nayef", "Mishal"
];

const arabicLastNames = [
  "Al-Rashid", "Al-Otaibi", "Al-Qahtani", "Al-Ghamdi", "Al-Harbi", "Al-Zahrani",
  "Al-Shehri", "Al-Dosari", "Al-Mutairi", "Al-Yami", "Al-Shamrani", "Al-Asmari",
  "Al-Khaldi", "Al-Subaie", "Al-Maliki", "Al-Tamimi", "Al-Anazi", "Al-Shammari",
  "Al-Enezi", "Al-Qadir"
];

function generateNationalId(): string {
  let id = "1";
  for (let i = 0; i < 9; i++) {
    id += Math.floor(Math.random() * 10).toString();
  }
  return id;
}

function getRandomName(): string {
  const firstName = arabicFirstNames[Math.floor(Math.random() * arabicFirstNames.length)];
  const lastName = arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)];
  return `${firstName} ${lastName}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

const violationTypes = [
  "Speeding", "Running Red Light", "Illegal Parking", "No Seatbelt", 
  "Using Phone While Driving", "Expired Registration", "Lane Violation"
];

const appointmentTypes = [
  "Passport Renewal", "ID Card Replacement", "License Renewal", 
  "Document Verification", "Fingerprint Update"
];

const delegationTypes = [
  "Vehicle", "Property", "Financial", "Legal", "Medical"
];

const locations = [
  "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", 
  "Tabuk", "Abha", "Hail", "Jizan"
];

async function seed() {
  console.log("Starting database seed...");
  
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const now = new Date();
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  for (let i = 1; i <= 100; i++) {
    const nationalId = generateNationalId();
    const name = getRandomName();
    
    const [user] = await db.insert(users).values({
      nationalId,
      password: i.toString(),
      name,
      email: `user${i}@absher.sa`,
      phone: `+966${500000000 + i}`,
    }).returning();

    console.log(`Created user ${i}: ${name}`);

    const passportExpiry = randomDate(now, oneYearFromNow);
    await db.insert(passports).values({
      userId: user.id,
      passportNumber: `P${Math.floor(100000000 + Math.random() * 900000000)}`,
      expiryDate: formatDate(passportExpiry),
      issueDate: formatDate(randomDate(threeYearsAgo, threeMonthsAgo)),
      status: passportExpiry < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) ? "expiring_soon" : "active",
    });

    const idExpiry = randomDate(now, oneYearFromNow);
    await db.insert(nationalIds).values({
      userId: user.id,
      idNumber: nationalId,
      expiryDate: formatDate(idExpiry),
      issueDate: formatDate(randomDate(threeYearsAgo, threeMonthsAgo)),
      status: idExpiry < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) ? "expiring_soon" : "active",
    });

    const licenseExpiry = randomDate(now, oneYearFromNow);
    await db.insert(drivingLicenses).values({
      userId: user.id,
      licenseNumber: `DL${Math.floor(10000000 + Math.random() * 90000000)}`,
      expiryDate: formatDate(licenseExpiry),
      issueDate: formatDate(randomDate(threeYearsAgo, threeMonthsAgo)),
      licenseType: Math.random() > 0.3 ? "private" : "commercial",
      status: licenseExpiry < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) ? "expiring_soon" : "active",
    });

    if (Math.random() > 0.6) {
      const numViolations = Math.floor(Math.random() * 3) + 1;
      for (let v = 0; v < numViolations; v++) {
        const discountExpiry = randomDate(now, threeDaysFromNow);
        await db.insert(violations).values({
          userId: user.id,
          violationNumber: `V${Math.floor(1000000 + Math.random() * 9000000)}`,
          violationType: violationTypes[Math.floor(Math.random() * violationTypes.length)],
          amount: Math.floor(Math.random() * 10) * 100 + 100,
          discountAmount: Math.floor(Math.random() * 5) * 50 + 50,
          discountExpiry,
          location: locations[Math.floor(Math.random() * locations.length)],
          violationDate: randomDate(threeMonthsAgo, now),
          status: Math.random() > 0.3 ? "unpaid" : "paid",
        });
      }
    }

    if (Math.random() > 0.7) {
      const appointmentDate = randomDate(now, oneWeekFromNow);
      await db.insert(appointments).values({
        userId: user.id,
        appointmentType: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
        appointmentDate,
        location: `Absher Center - ${locations[Math.floor(Math.random() * locations.length)]}`,
        status: "scheduled",
        notes: Math.random() > 0.5 ? "Please bring original documents" : null,
      });
    }

    if (Math.random() > 0.8) {
      const delegateNationalId = generateNationalId();
      await db.insert(delegations).values({
        userId: user.id,
        delegationType: delegationTypes[Math.floor(Math.random() * delegationTypes.length)],
        delegateNationalId,
        delegateName: getRandomName(),
        startDate: formatDate(threeMonthsAgo),
        expiryDate: formatDate(randomDate(now, oneYearFromNow)),
        status: "active",
      });
    }

    const isEligible = Math.random() > 0.5;
    await db.insert(hajjStatus).values({
      userId: user.id,
      eligible: isEligible,
      lastHajjYear: isEligible && Math.random() > 0.5 ? now.getFullYear() - Math.floor(Math.random() * 10) - 5 : null,
      registrationStatus: isEligible ? (Math.random() > 0.7 ? "registered" : "not_registered") : "not_eligible",
      registrationYear: null,
    });
  }

  console.log("Database seed completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
