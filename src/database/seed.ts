import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../features/customer/entities/customer.entity';
import { AppDataSource } from '../config/data-source';

config();

const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Barbara',
  'David',
  'Elizabeth',
  'Richard',
  'Susan',
  'Joseph',
  'Jessica',
  'Thomas',
  'Sarah',
  'Charles',
  'Karen',
  'Christopher',
  'Nancy',
  'Daniel',
  'Lisa',
  'Matthew',
  'Betty',
  'Anthony',
  'Margaret',
  'Mark',
  'Sandra',
  'Donald',
  'Ashley',
  'Steven',
  'Kimberly',
  'Paul',
  'Emily',
  'Andrew',
  'Donna',
  'Joshua',
  'Michelle',
  'Kenneth',
  'Carol',
  'Kevin',
  'Amanda',
  'Brian',
  'Dorothy',
  'George',
  'Melissa',
  'Timothy',
  'Deborah',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
  'Carter',
  'Roberts',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const firstPart = Math.floor(Math.random() * 900) + 100;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `+1-${areaCode}-${firstPart}-${secondPart}`;
}

function generateNationalId(): string {
  return `SSN-${Math.floor(Math.random() * 900000000) + 100000000}`;
}

function generateInternalNotes(): string | null {
  const notes = [
    'Premium customer',
    'Requires follow-up',
    'VIP status',
    'Payment terms: NET 30',
    'Corporate account',
    null,
    null,
    null, // More nulls to make it realistic
  ];
  return getRandomElement(notes);
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function seed() {
  console.log('Starting seed...');

  try {
    await AppDataSource.initialize();
    console.log('Data Source initialized');

    const customerRepository = AppDataSource.getRepository(Customer);

    // Clear existing data
    await customerRepository.clear();
    console.log('Cleared existing customers');

    const customers: Partial<Customer>[] = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date();

    for (let i = 0; i < 100; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const createdAt = generateRandomDate(startDate, endDate);

      customers.push({
        id: uuidv4(),
        fullName,
        email,
        phoneNumber: generatePhoneNumber(),
        nationalId: generateNationalId(),
        internalNotes: generateInternalNotes(),
        createdAt,
        updatedAt: createdAt,
      });
    }

    await customerRepository.save(customers);
    console.log('✅ Successfully seeded 100 customers');

    await AppDataSource.destroy();
    console.log('Data Source closed');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

void seed();
