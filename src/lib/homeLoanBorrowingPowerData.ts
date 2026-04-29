export type ApplicationType = 'single' | 'joint'
export type PropertyType = 'home' | 'investment'

export type BorrowingPowerInput = {
  applicationType: ApplicationType
  dependants: number
  propertyType: PropertyType
  primaryIncome: number | null
  primaryOtherIncome: number | null
  secondIncome: number | null
  secondOtherIncome: number | null
  monthlyLivingExpenses: number | null
  currentHomeLoanRepayments: number | null
  otherLoanRepayments: number | null
  otherMonthlyCommitments: number | null
  creditCardLimits: number | null
}

export type BorrowingPowerEstimate = {
  borrowingPower: number
  isValid: boolean
  baseProductRate: number
  assessmentRate: number
  netAnnualIncome: number
  netMonthlyIncome: number
  benchmarkLivingExpenses: number
  assessedLivingExpenses: number
  totalMonthlyCommitments: number
  monthlyRepaymentCapacity: number
}

type ThresholdRow = {
  incomeThreshold: number
  values: number[]
}

function buildThresholdRows(rows: Array<[number, number[]]>): ThresholdRow[] {
  return rows.map(([incomeThreshold, values]) => ({
    incomeThreshold,
    values,
  }))
}

export const applicationTypeLabels: Record<ApplicationType, string> = {
  single: 'Single',
  joint: 'Joint',
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  home: 'Home to live in',
  investment: 'Residential investment',
}

export const dependantOptions = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5+', value: 5 },
] as const

export const borrowingPowerRateAssumptions: Record<
  PropertyType,
  {
    label: string
    rate: number
  }
> = {
  home: {
    label: 'ANZ Simplicity PLUS home loan rate',
    rate: 6.04,
  },
  investment: {
    label: 'ANZ Simplicity PLUS residential investment property loan rate',
    rate: 6.29,
  },
}

const taxSchedule = [
  { amountThreshold: 18200.01, baseValue: 0, rate: 0.16 },
  { amountThreshold: 45000.01, baseValue: 4288, rate: 0.3 },
  { amountThreshold: 135000.01, baseValue: 31288, rate: 0.37 },
  { amountThreshold: 190000.01, baseValue: 51638, rate: 0.45 },
] as const

const medicareLevySchedule = [
  { amountThreshold: 27222, rate: 0.1 },
  { amountThreshold: 34027.01, rate: 0.02 },
] as const

const jointLivingExpenseRows = buildThresholdRows([
  [0, [2603, 3059, 3345, 3735, 4125, 4515, 4905, 5296, 5686, 6160, 6707]],
  [24753, [2603, 3059, 3345, 3735, 4125, 4515, 4905, 5296, 5686, 6160, 6707]],
  [34893, [2667, 3059, 3345, 3735, 4125, 4515, 4905, 5296, 5686, 6076, 6466]],
  [44573, [2775, 3168, 3453, 3735, 4017, 4300, 4582, 4918, 5401, 5885, 6368]],
  [54093, [2952, 3345, 3629, 3911, 4194, 4476, 4758, 5093, 5576, 6059, 6542]],
  [62933, [3226, 3620, 3902, 4184, 4467, 4749, 5031, 5363, 5845, 6328, 6810]],
  [80613, [3605, 4001, 4281, 4563, 4845, 5127, 5409, 5737, 6219, 6701, 7183]],
  [98293, [3927, 4324, 4602, 4884, 5166, 5448, 5729, 6054, 6536, 7018, 7499]],
  [114433, [4285, 4684, 4959, 5241, 5522, 5804, 6086, 6408, 6889, 7370, 7851]],
  [130903, [4495, 4895, 5169, 5451, 5732, 6014, 6296, 6615, 7096, 7577, 8057]],
  [145163, [4782, 5183, 5455, 5737, 6018, 6300, 6582, 6898, 7379, 7859, 8339]],
  [172723, [5289, 5692, 5961, 6242, 6524, 6805, 7086, 7398, 7878, 8357, 8837]],
  [207703, [6038, 6445, 6708, 6989, 7271, 7552, 7833, 8137, 8616, 9095, 9573]],
  [242683, [6103, 6509, 6773, 7054, 7335, 7616, 7897, 8201, 8679, 9158, 9636]],
])

const singleLivingExpenseRows = buildThresholdRows([
  [0, [1352, 1848, 2331, 2878, 3425, 3972, 4519, 5066, 5613, 6160, 6707]],
  [24753, [1419, 1848, 2331, 2878, 3425, 3972, 4519, 5066, 5613, 6160, 6707]],
  [34893, [1483, 1911, 2395, 2878, 3361, 3845, 4328, 4812, 5295, 5778, 6262]],
  [44573, [1591, 2019, 2502, 2985, 3469, 3952, 4435, 4918, 5401, 5885, 6368]],
  [54093, [1768, 2195, 2678, 3161, 3644, 4127, 4610, 5093, 5576, 6059, 6542]],
  [62933, [2043, 2467, 2950, 3432, 3915, 4398, 4880, 5363, 5845, 6328, 6810]],
  [80613, [2423, 2845, 3327, 3809, 4291, 4773, 5255, 5737, 6219, 6701, 7183]],
  [98293, [2745, 3165, 3647, 4128, 4610, 5091, 5573, 6054, 6536, 7018, 7499]],
  [114433, [3104, 3521, 4002, 4483, 4964, 5445, 5927, 6408, 6889, 7370, 7851]],
  [130903, [3314, 3731, 4211, 4692, 5173, 5654, 6134, 6615, 7096, 7577, 8057]],
  [145163, [3602, 4016, 4497, 4977, 5457, 5938, 6418, 6898, 7379, 7859, 8339]],
  [172723, [4109, 4520, 5000, 5480, 5959, 6439, 6919, 7398, 7878, 8357, 8837]],
  [207703, [4860, 5266, 5745, 6223, 6702, 7180, 7659, 8137, 8616, 9095, 9573]],
  [242683, [4925, 5330, 5809, 6287, 6766, 7244, 7723, 8201, 8679, 9158, 9636]],
])

export const borrowingPowerAssumptions = {
  loanTermYears: 30,
  paymentTypeLabel: 'Principal and interest',
  otherIncomeDiscount: 0.8,
  sensitivityMargin: 3,
  floorRate: 5.1,
  creditCardExpenseMultiplier: 0.038,
  homeLoanExpenseMultiplier: 1.4,
  otherLoanExpenseMultiplier: 1.1,
} as const

function sanitizeMoney(value: number | null | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function clampDependants(dependants: number) {
  const numericValue = Number.isFinite(dependants) ? Math.floor(dependants) : 0
  return Math.min(5, Math.max(0, numericValue))
}

function calculateTaxForIncome(annualIncome: number) {
  if (annualIncome <= taxSchedule[0].amountThreshold) {
    return 0
  }

  if (annualIncome <= taxSchedule[1].amountThreshold) {
    return (annualIncome - taxSchedule[0].amountThreshold) * taxSchedule[0].rate
  }

  if (annualIncome <= taxSchedule[2].amountThreshold) {
    return (
      taxSchedule[1].baseValue +
      (annualIncome - taxSchedule[1].amountThreshold) * taxSchedule[1].rate
    )
  }

  if (annualIncome <= taxSchedule[3].amountThreshold) {
    return (
      taxSchedule[2].baseValue +
      (annualIncome - taxSchedule[2].amountThreshold) * taxSchedule[2].rate
    )
  }

  return (
    taxSchedule[3].baseValue +
    (annualIncome - taxSchedule[3].amountThreshold) * taxSchedule[3].rate
  )
}

function calculateMedicareLevyCharge(annualIncome: number) {
  if (annualIncome <= medicareLevySchedule[0].amountThreshold) {
    return 0
  }

  if (annualIncome <= medicareLevySchedule[1].amountThreshold) {
    return (annualIncome - medicareLevySchedule[0].amountThreshold) * medicareLevySchedule[0].rate
  }

  return annualIncome * medicareLevySchedule[1].rate
}

function getBenchmarkLivingExpenses(
  applicationType: ApplicationType,
  netAnnualIncome: number,
  dependants: number,
) {
  const table = applicationType === 'joint' ? jointLivingExpenseRows : singleLivingExpenseRows

  let matchingRow = table[0]

  for (const row of table) {
    if (netAnnualIncome >= row.incomeThreshold) {
      matchingRow = row
    } else {
      break
    }
  }

  return matchingRow.values[clampDependants(dependants)] ?? matchingRow.values[5]
}

export function calculateBorrowingPowerEstimate(
  input: BorrowingPowerInput,
): BorrowingPowerEstimate {
  const primaryIncome = sanitizeMoney(input.primaryIncome)
  const primaryOtherIncome = sanitizeMoney(input.primaryOtherIncome)
  const secondIncome = input.applicationType === 'joint' ? sanitizeMoney(input.secondIncome) : 0
  const secondOtherIncome =
    input.applicationType === 'joint' ? sanitizeMoney(input.secondOtherIncome) : 0
  const monthlyLivingExpenses = sanitizeMoney(input.monthlyLivingExpenses)
  const currentHomeLoanRepayments = sanitizeMoney(input.currentHomeLoanRepayments)
  const otherLoanRepayments = sanitizeMoney(input.otherLoanRepayments)
  const otherMonthlyCommitments = sanitizeMoney(input.otherMonthlyCommitments)
  const creditCardLimits = sanitizeMoney(input.creditCardLimits)

  const primaryTax = calculateTaxForIncome(primaryIncome)
  const primaryMedicare = calculateMedicareLevyCharge(primaryIncome)
  const secondTax = calculateTaxForIncome(secondIncome)
  const secondMedicare = calculateMedicareLevyCharge(secondIncome)

  const netAnnualIncome =
    primaryIncome +
    primaryOtherIncome * borrowingPowerAssumptions.otherIncomeDiscount -
    primaryTax -
    primaryMedicare +
    secondIncome +
    secondOtherIncome * borrowingPowerAssumptions.otherIncomeDiscount -
    secondTax -
    secondMedicare

  const benchmarkLivingExpenses = getBenchmarkLivingExpenses(
    input.applicationType,
    netAnnualIncome,
    input.dependants,
  )

  const assessedLivingExpenses = Math.max(monthlyLivingExpenses, benchmarkLivingExpenses)
  const totalMonthlyCommitments =
    assessedLivingExpenses +
    creditCardLimits * borrowingPowerAssumptions.creditCardExpenseMultiplier +
    currentHomeLoanRepayments * borrowingPowerAssumptions.homeLoanExpenseMultiplier +
    otherLoanRepayments * borrowingPowerAssumptions.otherLoanExpenseMultiplier +
    otherMonthlyCommitments

  const netMonthlyIncome = netAnnualIncome / 12
  const monthlyRepaymentCapacity = netMonthlyIncome - totalMonthlyCommitments
  const baseProductRate = borrowingPowerRateAssumptions[input.propertyType].rate
  const assessmentRate = Math.max(
    borrowingPowerAssumptions.floorRate,
    baseProductRate + borrowingPowerAssumptions.sensitivityMargin,
  )
  const termMonths = borrowingPowerAssumptions.loanTermYears * 12
  const monthlyAssessmentRate = assessmentRate / 100 / 12 + 0.00001
  const rawBorrowingPower =
    (monthlyRepaymentCapacity - 1) /
    (monthlyAssessmentRate / (1 - Math.pow(1 + monthlyAssessmentRate, -termMonths)))

  const borrowingPower =
    Number.isFinite(rawBorrowingPower) && rawBorrowingPower > 0
      ? Math.ceil(Math.ceil(rawBorrowingPower) / 1000) * 1000
      : 0

  return {
    borrowingPower,
    isValid: borrowingPower >= 1000,
    baseProductRate,
    assessmentRate,
    netAnnualIncome,
    netMonthlyIncome,
    benchmarkLivingExpenses,
    assessedLivingExpenses,
    totalMonthlyCommitments,
    monthlyRepaymentCapacity,
  }
}
