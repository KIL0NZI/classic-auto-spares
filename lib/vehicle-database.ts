// lib/vehicle-database.ts
export const VEHICLE_DATABASE: Record<string, Record<string, number[]>> = {
  Toyota: {
    'Premio': [2007, 2010, 2012, 2015, 2018, 2020],
    'Probox': [2002, 2008, 2014, 2016, 2020, 2022],
    'Axio': [2012, 2014, 2016, 2018, 2021],
  },
  BMW: {
    '3 Series': [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    '5 Series': [2017, 2019, 2021, 2023],
  },
  Subaru: {
    'Forester': [2008, 2010, 2012, 2015, 2018, 2021],
    'WRX': [2015, 2017, 2019, 2021],
  },
}