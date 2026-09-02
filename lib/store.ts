export type VehicleCompatibility = {
  make: string
  model: string
  yearFrom?: number
  yearTo?: number
  chassis?: string[]
  engine?: string[]
  note?: string
}

export type PartStoreItem = {
  slug: string
  sku: string
  code: string
  name: string
  category: string
  price: number
  stock_quantity: number
  universalFit?: boolean
  compatibility: VehicleCompatibility[]
  condition: 'New' | 'Refurbished' | 'Ex-Japan / Used'
  tag?: string
  image?: string
  description?: string
  highlights?: string[]
  images?: string[]
  relatedSlugs?: string[]
}

export function normalizePartCategory(category: string): string {
  const normalized = category.trim()

  const categoryMap: Record<string, string> = {
    'Braking System': 'Braking',
    'Filters & Maintenance': 'Engine',
    'Ignition & Electrical': 'Electrical',
    'Suspension & Steering': 'Suspension',
    'Engine & Cooling': 'Engine',
    'Transmission & Drivetrain': 'Engine',
    'Sensors & Electronics': 'Electrical',
    'Body & Lighting': 'Body & Exterior',
    'Body & Exterior': 'Body & Exterior',
    'Lighting': 'Lighting',
  }

  return categoryMap[normalized] ?? normalized
}

export const partStore: PartStoreItem[] = [
  {
    slug: 'ceramic-front-brake-pads-set',
    sku: 'BRK-PAD-001',
    code: 'BRK-PAD-001',
    name: 'Ceramic Front Brake Pads Set',
    category: 'Braking System',
    price: 4500,
    stock_quantity: 25,
    compatibility: [
      { make: 'Toyota', model: 'Premio', yearFrom: 2007, yearTo: 2020, chassis: ['T260'] },
      { make: 'Toyota', model: 'Axio', yearFrom: 2012, yearTo: 2020, chassis: ['NRE160', 'NZE161'] },
      { make: 'Toyota', model: 'Fielder', yearFrom: 2012, yearTo: 2020, chassis: ['NZE161'] },
    ],
    condition: 'New',
    tag: 'Best seller',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'vented-front-brake-discs-pair',
    sku: 'BRK-DSK-002',
    code: 'BRK-DSK-002',
    name: 'Vented Front Brake Discs (Pair)',
    category: 'Braking System',
    price: 8500,
    stock_quantity: 18,
    compatibility: [
      { make: 'Subaru', model: 'Forester', yearFrom: 2008, yearTo: 2013, chassis: ['SH'] },
      { make: 'Subaru', model: 'Legacy', yearFrom: 2008, yearTo: 2012, chassis: ['BL', 'BP', 'BM', 'BR'] },
    ],
    condition: 'New',
    tag: 'Popular',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'brake-master-cylinder-assembly',
    sku: 'BRK-MCR-003',
    code: 'BRK-MCR-003',
    name: 'Brake Master Cylinder Assembly',
    category: 'Braking System',
    price: 7200,
    stock_quantity: 10,
    compatibility: [
      { make: 'Mitsubishi', model: 'Pajero', yearFrom: 2000, yearTo: 2006, chassis: ['V73'] },
      { make: 'Mitsubishi', model: 'Pajero iO', yearFrom: 1998, yearTo: 2007, chassis: ['H60', 'H70'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'rear-brake-shoe-set',
    sku: 'BRK-SHU-004',
    code: 'BRK-SHU-004',
    name: 'Rear Brake Shoe Set',
    category: 'Braking System',
    price: 2800,
    stock_quantity: 30,
    compatibility: [
      { make: 'Toyota', model: 'Probox', yearFrom: 2002, yearTo: 2014, chassis: ['NCP50', 'NCP51', 'NCP55'] },
      { make: 'Toyota', model: 'Succeed', yearFrom: 2002, yearTo: 2014, chassis: ['NCP58', 'NCP59'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'front-left-brake-caliper-assembly',
    sku: 'BRK-CAL-005',
    code: 'BRK-CAL-005',
    name: 'Front Left Brake Caliper Assembly',
    category: 'Braking System',
    price: 9500,
    stock_quantity: 6,
    compatibility: [
      { make: 'Toyota', model: 'Land Cruiser Prado', yearFrom: 2002, yearTo: 2009, chassis: ['120 Series', 'GRJ120', 'KDJ120'] },
    ],
    condition: 'Ex-Japan / Used',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'high-efficiency-synthetic-oil-filter',
    sku: 'FLT-OIL-006',
    code: 'FLT-OIL-006',
    name: 'High-Efficiency Synthetic Oil Filter',
    category: 'Filters & Maintenance',
    price: 850,
    stock_quantity: 100,
    compatibility: [
      { make: 'Toyota', model: 'Premio', yearFrom: 2001, yearTo: 2020, engine: ['1NZ-FE', '2NZ-FE'] },
      { make: 'Toyota', model: 'Allion', yearFrom: 2001, yearTo: 2020, engine: ['1NZ-FE', '2NZ-FE'] },
      { make: 'Toyota', model: 'Vitz', yearFrom: 1999, yearTo: 2019, engine: ['1NZ-FE', '2NZ-FE'] },
      { make: 'Toyota', model: 'Probox', yearFrom: 2002, yearTo: 2022, engine: ['1NZ-FE', '2NZ-FE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'engine-air-filter-element',
    sku: 'FLT-AIR-007',
    code: 'FLT-AIR-007',
    name: 'Engine Air Filter Element',
    category: 'Filters & Maintenance',
    price: 1200,
    stock_quantity: 75,
    compatibility: [
      { make: 'Nissan', model: 'X-Trail', yearFrom: 2007, yearTo: 2013, chassis: ['T31'], engine: ['MR20DE', 'QR25DE'] },
      { make: 'Nissan', model: 'Serena', yearFrom: 2005, yearTo: 2010, chassis: ['C25'], engine: ['MR20DE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'cabin-ac-air-filter',
    sku: 'FLT-CAB-008',
    code: 'FLT-CAB-008',
    name: 'Cabin AC Air Filter',
    category: 'Filters & Maintenance',
    price: 1000,
    stock_quantity: 60,
    compatibility: [
      { make: 'Honda', model: 'CR-V', yearFrom: 2006, yearTo: 2012, chassis: ['RE'] },
      { make: 'Honda', model: 'Civic', yearFrom: 2006, yearTo: 2011, chassis: ['FD'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'in-tank-fuel-filter-assembly',
    sku: 'FLT-FUL-009',
    code: 'FLT-FUL-009',
    name: 'In-Tank Fuel Filter Assembly',
    category: 'Filters & Maintenance',
    price: 3500,
    stock_quantity: 20,
    compatibility: [
      { make: 'Mazda', model: 'Demio', yearFrom: 2007, yearTo: 2014, chassis: ['DE3FS', 'DE5FS'], engine: ['ZJ-VE', 'ZY-VE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'iridium-spark-plugs-pack-of-4',
    sku: 'IGN-SPK-010',
    code: 'IGN-SPK-010',
    name: 'Iridium Spark Plugs (Pack of 4)',
    category: 'Ignition & Electrical',
    price: 3200,
    stock_quantity: 40,
    compatibility: [
      { make: 'Toyota', model: 'Axio', yearFrom: 2012, yearTo: 2020, engine: ['1NZ-FE', '2NR-FKE'] },
      { make: 'Toyota', model: 'Probox', yearFrom: 2014, yearTo: 2022, chassis: ['NCP160'], engine: ['1NR-FE'] },
      { make: 'Nissan', model: 'Latio', yearFrom: 2004, yearTo: 2012, engine: ['HR15DE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'direct-ignition-coil-pack',
    sku: 'IGN-COL-011',
    code: 'IGN-COL-011',
    name: 'Direct Ignition Coil Pack',
    category: 'Ignition & Electrical',
    price: 3800,
    stock_quantity: 35,
    compatibility: [
      { make: 'Toyota', model: 'Vitz', yearFrom: 2012, yearTo: 2015, engine: ['1KR-FE', '1NR-FE'] },
      { make: 'Toyota', model: 'Premio', yearFrom: 2007, yearTo: 2016, engine: ['1NZ-FE', '2ZR-FAE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'maintenance-free-12v-65ah-battery',
    sku: 'ELE-BAT-012',
    code: 'ELE-BAT-012',
    name: 'Maintenance-Free 12V 65Ah Battery',
    category: 'Ignition & Electrical',
    price: 10500,
    stock_quantity: 12,
    universalFit: true,
    compatibility: [
      { make: 'Universal', model: 'Universal Fit (Japanese Standard Terminal)', yearFrom: 1995, yearTo: 2024 },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: '12v-90a-engine-alternator',
    sku: 'ELE-ALT-013',
    code: 'ELE-ALT-013',
    name: '12V 90A Engine Alternator',
    category: 'Ignition & Electrical',
    price: 16500,
    stock_quantity: 7,
    compatibility: [
      { make: 'Toyota', model: 'HiAce', yearFrom: 2004, yearTo: 2018, chassis: ['KDH200'], engine: ['2KD-FTV', '1KD-FTV'] },
      { make: 'Toyota', model: 'Hilux', yearFrom: 2005, yearTo: 2015, engine: ['2KD-FTV', '1KD-FTV'] },
    ],
    condition: 'Refurbished',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'front-suspension-stabilizer-link-pair',
    sku: 'SUS-STB-014',
    code: 'SUS-STB-014',
    name: 'Front Suspension Stabilizer Link Pair',
    category: 'Suspension & Steering',
    price: 3800,
    stock_quantity: 15,
    compatibility: [
      { make: 'Honda', model: 'CR-V', yearFrom: 2006, yearTo: 2012, chassis: ['RE'] },
      { make: 'Mazda', model: 'CX-5', yearFrom: 2012, yearTo: 2017, chassis: ['KE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'heavy-duty-shock-absorbers-front-pair',
    sku: 'SUS-SHK-015',
    code: 'SUS-SHK-015',
    name: 'Heavy-Duty Shock Absorbers (Front Pair)',
    category: 'Suspension & Steering',
    price: 16000,
    stock_quantity: 14,
    compatibility: [
      { make: 'Toyota', model: 'Vitz', yearFrom: 2005, yearTo: 2011, chassis: ['SCP90', 'NCP91', 'KSP90'] },
      { make: 'Toyota', model: 'Ractis', yearFrom: 2005, yearTo: 2010, chassis: ['SCP100', 'NCP100'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'lower-control-arm-ball-joint-set',
    sku: 'SUS-BAL-016',
    code: 'SUS-BAL-016',
    name: 'Lower Control Arm Ball Joint Set',
    category: 'Suspension & Steering',
    price: 2800,
    stock_quantity: 22,
    compatibility: [
      { make: 'Nissan', model: 'Tiida', yearFrom: 2004, yearTo: 2012, chassis: ['C11'] },
      { make: 'Nissan', model: 'Note', yearFrom: 2005, yearTo: 2012, chassis: ['E11'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'power-steering-rack-assembly',
    sku: 'STR-RCK-017',
    code: 'STR-RCK-017',
    name: 'Power Steering Rack Assembly',
    category: 'Suspension & Steering',
    price: 24500,
    stock_quantity: 4,
    compatibility: [
      { make: 'Toyota', model: 'Land Cruiser Prado', yearFrom: 2002, yearTo: 2009, chassis: ['120 Series'] },
    ],
    condition: 'Ex-Japan / Used',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'inner-and-outer-tie-rod-end-kit',
    sku: 'STR-TIE-018',
    code: 'STR-TIE-018',
    name: 'Inner & Outer Tie Rod End Kit',
    category: 'Suspension & Steering',
    price: 4200,
    stock_quantity: 18,
    compatibility: [
      { make: 'Subaru', model: 'Impreza', yearFrom: 2007, yearTo: 2014, chassis: ['GH', 'GE', 'GR', 'GV'] },
      { make: 'Subaru', model: 'Forester', yearFrom: 2008, yearTo: 2013, chassis: ['SH'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'aluminum-complete-engine-radiator',
    sku: 'ENG-RAD-019',
    code: 'ENG-RAD-019',
    name: 'Aluminum Complete Engine Radiator',
    category: 'Engine & Cooling',
    price: 14500,
    stock_quantity: 8,
    compatibility: [
      { make: 'Mazda', model: 'Demio', yearFrom: 2007, yearTo: 2014, chassis: ['DE3FS', 'DE5FS'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'engine-water-pump-assembly',
    sku: 'ENG-PMP-020',
    code: 'ENG-PMP-020',
    name: 'Engine Water Pump Assembly',
    category: 'Engine & Cooling',
    price: 5200,
    stock_quantity: 16,
    compatibility: [
      { make: 'Toyota', model: 'Premio', yearFrom: 2001, yearTo: 2007, engine: ['1AZ-FSE', '2AZ-FE'] },
      { make: 'Toyota', model: 'Allion', yearFrom: 2001, yearTo: 2007, engine: ['1AZ-FSE'] },
      { make: 'Toyota', model: 'RAV4', yearFrom: 2000, yearTo: 2008, engine: ['1AZ-FE', '2AZ-FE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'coolant-thermostat-assembly',
    sku: 'ENG-THM-021',
    code: 'ENG-THM-021',
    name: 'Coolant Thermostat Assembly',
    category: 'Engine & Cooling',
    price: 2500,
    stock_quantity: 25,
    compatibility: [
      { make: 'Nissan', model: 'X-Trail', yearFrom: 2001, yearTo: 2013, engine: ['QR20DE', 'MR20DE'] },
      { make: 'Nissan', model: 'Serena', yearFrom: 2005, yearTo: 2010, engine: ['MR20DE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'serpentine-fan-belt-6pk1210',
    sku: 'ENG-BEL-022',
    code: 'ENG-BEL-022',
    name: 'Serpentine Fan Belt (6PK1210)',
    category: 'Engine & Cooling',
    price: 1800,
    stock_quantity: 50,
    compatibility: [
      { make: 'Nissan', model: 'X-Trail', yearFrom: 2007, yearTo: 2013, chassis: ['T31'], engine: ['MR20DE'] },
      { make: 'Nissan', model: 'Serena', yearFrom: 2005, yearTo: 2010, chassis: ['C25'], engine: ['MR20DE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'hydraulic-engine-mounting-right',
    sku: 'ENG-MNT-023',
    code: 'ENG-MNT-023',
    name: 'Hydraulic Engine Mounting (Right)',
    category: 'Engine & Cooling',
    price: 5500,
    stock_quantity: 11,
    compatibility: [
      { make: 'Honda', model: 'Civic', yearFrom: 2006, yearTo: 2011, chassis: ['FD1', 'FD2'], engine: ['R18A', 'R20A'] },
      { make: 'Honda', model: 'Stream', yearFrom: 2006, yearTo: 2014, chassis: ['RN6', 'RN8'], engine: ['R18A', 'R20A'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'cylinder-head-gasket-full-overhaul-kit',
    sku: 'ENG-GKT-024',
    code: 'ENG-GKT-024',
    name: 'Cylinder Head Gasket Full Overhaul Kit',
    category: 'Engine & Cooling',
    price: 6200,
    stock_quantity: 9,
    compatibility: [
      { make: 'Toyota', model: 'Probox', yearFrom: 2002, yearTo: 2020, engine: ['1NZ-FE'] },
      { make: 'Toyota', model: 'Vitz', yearFrom: 1999, yearTo: 2017, engine: ['1NZ-FE'] },
      { make: 'Toyota', model: 'Axio', yearFrom: 2006, yearTo: 2018, engine: ['1NZ-FE'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'outer-cv-joint-kit-with-boot',
    sku: 'TRN-CVJ-025',
    code: 'TRN-CVJ-025',
    name: 'Outer CV Joint Kit with Boot',
    category: 'Transmission & Drivetrain',
    price: 3500,
    stock_quantity: 30,
    compatibility: [
      { make: 'Toyota', model: 'Probox', yearFrom: 2002, yearTo: 2014, chassis: ['NCP50', 'NCP51'] },
      { make: 'Toyota', model: 'Vitz', yearFrom: 2005, yearTo: 2010, chassis: ['SCP90', 'NCP91'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: '3-piece-heavy-duty-clutch-kit',
    sku: 'TRN-CLT-026',
    code: 'TRN-CLT-026',
    name: '3-Piece Heavy Duty Clutch Kit',
    category: 'Transmission & Drivetrain',
    price: 14500,
    stock_quantity: 8,
    compatibility: [
      { make: 'Isuzu', model: 'D-Max', yearFrom: 2008, yearTo: 2020, engine: ['4JK1', '4JJ1'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'synthetic-cvt-fluid-tcfe-4l',
    sku: 'TRN-FLD-027',
    code: 'TRN-FLD-027',
    name: 'Synthetic CVT Fluid TC/FE (4L)',
    category: 'Transmission & Drivetrain',
    price: 6500,
    stock_quantity: 40,
    universalFit: true,
    compatibility: [
      { make: 'Toyota', model: 'All CVT Models', yearFrom: 2004, yearTo: 2024 },
      { make: 'Nissan', model: 'All CVT Models', yearFrom: 2005, yearTo: 2024 },
      { make: 'Honda', model: 'All CVT Models', yearFrom: 2003, yearTo: 2024 },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'upstream-exhaust-oxygen-o2-sensor',
    sku: 'SEN-OXY-028',
    code: 'SEN-OXY-028',
    name: 'Upstream Exhaust Oxygen O2 Sensor',
    category: 'Sensors & Electronics',
    price: 4800,
    stock_quantity: 12,
    compatibility: [
      { make: 'Subaru', model: 'Forester', yearFrom: 2008, yearTo: 2013, chassis: ['SH'], engine: ['EJ20', 'EJ25'] },
      { make: 'Subaru', model: 'Legacy', yearFrom: 2009, yearTo: 2014, chassis: ['BM', 'BR'], engine: ['EJ25'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'mass-air-flow-maf-sensor',
    sku: 'SEN-MAF-029',
    code: 'SEN-MAF-029',
    name: 'Mass Air Flow (MAF) Sensor',
    category: 'Sensors & Electronics',
    price: 5500,
    stock_quantity: 15,
    compatibility: [
      { make: 'Toyota', model: 'Allion', yearFrom: 2007, yearTo: 2020, chassis: ['T260'] },
      { make: 'Toyota', model: 'Premio', yearFrom: 2007, yearTo: 2020, chassis: ['T260'] },
    ],
    condition: 'New',
    image: '/Classic Auto Spares-hero.png',
  },
  {
    slug: 'electric-side-mirror-assembly-right',
    sku: 'BDY-MIR-030',
    code: 'BDY-MIR-030',
    name: 'Electric Side Mirror Assembly (Right)',
    category: 'Body & Lighting',
    price: 11500,
    stock_quantity: 5,
    compatibility: [
      { make: 'Toyota', model: 'Vitz', yearFrom: 2012, yearTo: 2015, chassis: ['KSP130', 'NSP130'] },
    ],
    condition: 'Ex-Japan / Used',
    image: '/Classic Auto Spares-hero.png',
  },
]