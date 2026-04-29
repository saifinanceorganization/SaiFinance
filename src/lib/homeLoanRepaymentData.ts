export type PropertyType = 'owner_occupier' | 'investment'
export type RateType = 'variable' | 'fixed'
export type PaymentType = 'pi' | 'io-1' | 'io-2' | 'io-3' | 'io-4' | 'io-5' | 'io-7' | 'io-10'

export type PaymentTypeOption = {
  value: PaymentType
  label: string
  interestOnlyYears: number | null
}

export type RateOption = {
  id: string
  label: string
  rate: number
  comparisonRate: number
  fixedTermYears?: number
  fallbackRate?: number
  fallbackLabel?: string
}

type PropertyRateConfig = {
  paymentTypes: PaymentTypeOption[]
  variable: {
    pi: RateOption[]
    io: RateOption[]
  }
  fixed: {
    pi: RateOption[]
    io: Record<number, RateOption[]>
    customPeriods: number[]
  }
}

const paymentType = (value: PaymentType, label: string, interestOnlyYears: number | null): PaymentTypeOption => ({
  value,
  label,
  interestOnlyYears,
})

const rate = (
  id: string,
  label: string,
  rateValue: number,
  comparisonRate: number,
  extras: Partial<Pick<RateOption, 'fixedTermYears' | 'fallbackRate' | 'fallbackLabel'>> = {},
): RateOption => ({
  id,
  label,
  rate: rateValue,
  comparisonRate,
  ...extras,
})

export const propertyTypeLabels: Record<PropertyType, string> = {
  owner_occupier: 'Owner occupier',
  investment: 'Residential investment',
}

export const rateTypeLabels: Record<RateType, string> = {
  variable: 'Variable',
  fixed: 'Fixed',
}

export const repaymentCalculatorData: Record<PropertyType, PropertyRateConfig> = {
  owner_occupier: {
    paymentTypes: [
      paymentType('pi', 'Principal and Interest', null),
      paymentType('io-1', '1 year Interest only', 1),
      paymentType('io-2', '2 years Interest only', 2),
      paymentType('io-3', '3 years Interest only', 3),
      paymentType('io-4', '4 years Interest only', 4),
      paymentType('io-5', '5 years Interest only', 5),
    ],
    variable: {
      pi: [
        rate('owner-variable-pi-standard-80', '6.74% p.a Standard Variable 80% or less LVR', 6.74, 6.74),
        rate('owner-variable-pi-standard-gt80', '6.94% p.a Standard Variable more than 80% LVR', 6.94, 6.94),
        rate('owner-variable-pi-simplicity-base', '7.49% p.a Simplicity PLUS', 7.49, 7.49),
        rate('owner-variable-pi-simplicity-60', '5.89% p.a Simplicity PLUS special offer discount 60% or less LVR*', 5.89, 5.9),
        rate('owner-variable-pi-simplicity-70', '5.94% p.a Simplicity PLUS special offer discount 70% or less LVR*', 5.94, 5.95),
        rate('owner-variable-pi-simplicity-80', '6.04% p.a Simplicity PLUS special offer discount 80% or less LVR*', 6.04, 6.04),
        rate('owner-variable-pi-simplicity-90', '6.59% p.a Simplicity PLUS special offer discount 90% or less LVR*', 6.59, 6.59),
        rate('owner-variable-pi-simplicity-gt90', '7.14% p.a Simplicity PLUS special offer discount more than 90% LVR*', 7.14, 7.14),
      ],
      io: [
        rate(
          'owner-variable-io-standard-80',
          '7.29% p.a Standard Variable 80% or less LVR',
          7.29,
          6.98,
          {
            fallbackRate: 6.74,
            fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
          },
        ),
        rate(
          'owner-variable-io-standard-gt80',
          '7.49% p.a Standard Variable more than 80% LVR',
          7.49,
          7.19,
          {
            fallbackRate: 6.94,
            fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
          },
        ),
      ],
    },
    fixed: {
      customPeriods: [1, 2, 3, 4, 5],
      pi: [
        rate('owner-fixed-pi-1-gt80', '6.34% p.a 1 year Fixed', 6.34, 6.88, {
          fixedTermYears: 1,
          fallbackRate: 6.94,
          fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
        }),
        rate('owner-fixed-pi-1-80', '5.89% p.a 1 year Fixed 80% or less LVR', 5.89, 6.66, {
          fixedTermYears: 1,
          fallbackRate: 6.74,
          fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
        }),
        rate('owner-fixed-pi-2-gt80', '6.24% p.a 2 years Fixed', 6.24, 6.8, {
          fixedTermYears: 2,
          fallbackRate: 6.94,
          fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
        }),
        rate('owner-fixed-pi-2-80', '5.79% p.a 2 years Fixed 80% or less LVR', 5.79, 6.56, {
          fixedTermYears: 2,
          fallbackRate: 6.74,
          fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
        }),
        rate('owner-fixed-pi-3-gt80', '6.49% p.a 3 years Fixed', 6.49, 6.81, {
          fixedTermYears: 3,
          fallbackRate: 6.94,
          fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
        }),
        rate('owner-fixed-pi-3-80', '6.04% p.a 3 years Fixed 80% or less LVR', 6.04, 6.54, {
          fixedTermYears: 3,
          fallbackRate: 6.74,
          fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
        }),
        rate('owner-fixed-pi-4-gt80', '6.54% p.a 4 years Fixed', 6.54, 6.8, {
          fixedTermYears: 4,
          fallbackRate: 6.94,
          fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
        }),
        rate('owner-fixed-pi-4-80', '6.09% p.a 4 years Fixed 80% or less LVR', 6.09, 6.51, {
          fixedTermYears: 4,
          fallbackRate: 6.74,
          fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
        }),
        rate('owner-fixed-pi-5-gt80', '6.69% p.a 5 years Fixed', 6.69, 6.83, {
          fixedTermYears: 5,
          fallbackRate: 6.94,
          fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
        }),
        rate('owner-fixed-pi-5-80', '6.24% p.a 5 years Fixed 80% or less LVR', 6.24, 6.52, {
          fixedTermYears: 5,
          fallbackRate: 6.74,
          fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
        }),
      ],
      io: {
        1: [
          rate('owner-fixed-io-1-gt80', '6.79% p.a 1 year Fixed', 6.79, 6.93, {
            fixedTermYears: 1,
            fallbackRate: 6.94,
            fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
          }),
          rate('owner-fixed-io-1-80', '6.34% p.a 1 year Fixed 80% or less LVR', 6.34, 6.7, {
            fixedTermYears: 1,
            fallbackRate: 6.74,
            fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
          }),
        ],
        2: [
          rate('owner-fixed-io-2-gt80', '6.64% p.a 2 years Fixed', 6.64, 6.88, {
            fixedTermYears: 2,
            fallbackRate: 6.94,
            fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
          }),
          rate('owner-fixed-io-2-80', '6.19% p.a 2 years Fixed 80% or less LVR', 6.19, 6.64, {
            fixedTermYears: 2,
            fallbackRate: 6.74,
            fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
          }),
        ],
        3: [
          rate('owner-fixed-io-3-gt80', '6.94% p.a 3 years Fixed', 6.94, 6.94, {
            fixedTermYears: 3,
            fallbackRate: 6.94,
            fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
          }),
          rate('owner-fixed-io-3-80', '6.49% p.a 3 years Fixed 80% or less LVR', 6.49, 6.67, {
            fixedTermYears: 3,
            fallbackRate: 6.74,
            fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
          }),
        ],
        4: [
          rate('owner-fixed-io-4-gt80', '6.99% p.a 4 years Fixed', 6.99, 6.96, {
            fixedTermYears: 4,
            fallbackRate: 6.94,
            fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
          }),
          rate('owner-fixed-io-4-80', '6.54% p.a 4 years Fixed 80% or less LVR', 6.54, 6.67, {
            fixedTermYears: 4,
            fallbackRate: 6.74,
            fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
          }),
        ],
        5: [
          rate('owner-fixed-io-5-gt80', '7.09% p.a 5 years Fixed', 7.09, 7.01, {
            fixedTermYears: 5,
            fallbackRate: 6.94,
            fallbackLabel: '6.94% p.a Standard Variable more than 80% LVR',
          }),
          rate('owner-fixed-io-5-80', '6.64% p.a 5 years Fixed 80% or less LVR', 6.64, 6.7, {
            fixedTermYears: 5,
            fallbackRate: 6.74,
            fallbackLabel: '6.74% p.a Standard Variable 80% or less LVR',
          }),
        ],
      },
    },
  },
  investment: {
    paymentTypes: [
      paymentType('pi', 'Principal and Interest', null),
      paymentType('io-1', '1 year Interest only', 1),
      paymentType('io-2', '2 years Interest only', 2),
      paymentType('io-3', '3 years Interest only', 3),
      paymentType('io-4', '4 years Interest only', 4),
      paymentType('io-5', '5 years Interest only', 5),
      paymentType('io-7', '7 years Interest only', 7),
      paymentType('io-10', '10 years Interest only', 10),
    ],
    variable: {
      pi: [
        rate('investment-variable-pi-standard-80', '7.34% p.a Standard Variable 80% or less LVR', 7.34, 7.34),
        rate('investment-variable-pi-standard-gt80', '7.54% p.a Standard Variable more than 80% LVR', 7.54, 7.54),
        rate('investment-variable-pi-simplicity-base', '7.49% p.a Simplicity PLUS', 7.49, 7.49),
        rate('investment-variable-pi-simplicity-60', '6.14% p.a Simplicity PLUS special offer discount 60% or less LVR*', 6.14, 6.14),
        rate('investment-variable-pi-simplicity-70', '6.19% p.a Simplicity PLUS special offer discount 70% or less LVR*', 6.19, 6.19),
        rate('investment-variable-pi-simplicity-80', '6.29% p.a Simplicity PLUS special offer discount 80% or less LVR*', 6.29, 6.29),
        rate('investment-variable-pi-simplicity-90', '6.99% p.a Simplicity PLUS special offer discount 90% or less LVR*', 6.99, 6.99),
        rate('investment-variable-pi-simplicity-gt90', '7.49% p.a Simplicity PLUS special offer discount more than 90% LVR*', 7.49, 7.49),
      ],
      io: [
        rate(
          'investment-variable-io-standard-80',
          '7.59% p.a Standard Variable 80% or less LVR',
          7.59,
          7.45,
          {
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          },
        ),
        rate(
          'investment-variable-io-standard-gt80',
          '7.79% p.a Standard Variable more than 80% LVR',
          7.79,
          7.65,
          {
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          },
        ),
        rate(
          'investment-variable-io-simplicity-base',
          '7.48% p.a Simplicity PLUS',
          7.48,
          7.49,
          {
            fallbackRate: 7.49,
            fallbackLabel: '7.49% p.a Simplicity PLUS',
          },
        ),
        rate(
          'investment-variable-io-simplicity-60',
          '6.54% p.a Simplicity PLUS special offer discount 60% or less LVR*',
          6.54,
          6.31,
          {
            fallbackRate: 6.14,
            fallbackLabel: '6.14% p.a Simplicity PLUS special offer discount 60% or less LVR*',
          },
        ),
        rate(
          'investment-variable-io-simplicity-70',
          '6.59% p.a Simplicity PLUS special offer discount 70% or less LVR*',
          6.59,
          6.36,
          {
            fallbackRate: 6.19,
            fallbackLabel: '6.19% p.a Simplicity PLUS special offer discount 70% or less LVR*',
          },
        ),
        rate(
          'investment-variable-io-simplicity-80',
          '6.69% p.a Simplicity PLUS special offer discount 80% or less LVR*',
          6.69,
          6.47,
          {
            fallbackRate: 6.29,
            fallbackLabel: '6.29% p.a Simplicity PLUS special offer discount 80% or less LVR*',
          },
        ),
        rate(
          'investment-variable-io-simplicity-90',
          '7.29% p.a Simplicity PLUS special offer discount 90% or less LVR*',
          7.29,
          7.13,
          {
            fallbackRate: 6.99,
            fallbackLabel: '6.99% p.a Simplicity PLUS special offer discount 90% or less LVR*',
          },
        ),
        rate(
          'investment-variable-io-simplicity-gt90',
          '7.48% p.a Simplicity PLUS special offer discount more than 90% LVR*',
          7.48,
          7.49,
          {
            fallbackRate: 7.49,
            fallbackLabel: '7.49% p.a Simplicity PLUS special offer discount more than 90% LVR*',
          },
        ),
      ],
    },
    fixed: {
      customPeriods: [1, 2, 3, 4, 5, 7, 10],
      pi: [
        rate('investment-fixed-pi-1-gt80', '6.44% p.a 1 year Fixed', 6.44, 7.43, {
          fixedTermYears: 1,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-1-80', '5.99% p.a 1 year Fixed 80% or less LVR', 5.99, 7.2, {
          fixedTermYears: 1,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
        rate('investment-fixed-pi-2-gt80', '6.34% p.a 2 years Fixed', 6.34, 7.3, {
          fixedTermYears: 2,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-2-80', '5.89% p.a 2 years Fixed 80% or less LVR', 5.89, 7.05, {
          fixedTermYears: 2,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
        rate('investment-fixed-pi-3-gt80', '6.54% p.a 3 years Fixed', 6.54, 7.25, {
          fixedTermYears: 3,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-3-80', '6.09% p.a 3 years Fixed 80% or less LVR', 6.09, 6.98, {
          fixedTermYears: 3,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
        rate('investment-fixed-pi-4-gt80', '6.74% p.a 4 years Fixed', 6.74, 7.24, {
          fixedTermYears: 4,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-4-80', '6.29% p.a 4 years Fixed 80% or less LVR', 6.29, 6.95, {
          fixedTermYears: 4,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
        rate('investment-fixed-pi-5-gt80', '6.89% p.a 5 years Fixed', 6.89, 7.25, {
          fixedTermYears: 5,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-5-80', '6.44% p.a 5 years Fixed 80% or less LVR', 6.44, 6.94, {
          fixedTermYears: 5,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
        rate('investment-fixed-pi-7-gt80', '7.69% p.a 7 years Fixed', 7.69, 7.63, {
          fixedTermYears: 7,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-7-80', '7.24% p.a 7 years Fixed 80% or less LVR', 7.24, 7.29, {
          fixedTermYears: 7,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
        rate('investment-fixed-pi-10-gt80', '7.69% p.a 10 years Fixed', 7.69, 7.65, {
          fixedTermYears: 10,
          fallbackRate: 7.54,
          fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
        }),
        rate('investment-fixed-pi-10-80', '7.24% p.a 10 years Fixed 80% or less LVR', 7.24, 7.27, {
          fixedTermYears: 10,
          fallbackRate: 7.34,
          fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
        }),
      ],
      io: {
        1: [
          rate('investment-fixed-io-1-gt80', '6.39% p.a 1 year Fixed', 6.39, 7.42, {
            fixedTermYears: 1,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-1-80', '5.94% p.a 1 year Fixed 80% or less LVR', 5.94, 7.2, {
            fixedTermYears: 1,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
        2: [
          rate('investment-fixed-io-2-gt80', '6.49% p.a 2 years Fixed', 6.49, 7.33, {
            fixedTermYears: 2,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-2-80', '6.04% p.a 2 years Fixed 80% or less LVR', 6.04, 7.08, {
            fixedTermYears: 2,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
        3: [
          rate('investment-fixed-io-3-gt80', '6.69% p.a 3 years Fixed', 6.69, 7.3, {
            fixedTermYears: 3,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-3-80', '6.24% p.a 3 years Fixed 80% or less LVR', 6.24, 7.03, {
            fixedTermYears: 3,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
        4: [
          rate('investment-fixed-io-4-gt80', '6.84% p.a 4 years Fixed', 6.84, 7.29, {
            fixedTermYears: 4,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-4-80', '6.39% p.a 4 years Fixed 80% or less LVR', 6.39, 7, {
            fixedTermYears: 4,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
        5: [
          rate('investment-fixed-io-5-gt80', '6.94% p.a 5 years Fixed', 6.94, 7.28, {
            fixedTermYears: 5,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-5-80', '6.49% p.a 5 years Fixed 80% or less LVR', 6.49, 6.98, {
            fixedTermYears: 5,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
        7: [
          rate('investment-fixed-io-7-gt80', '7.69% p.a 7 years Fixed', 7.69, 7.63, {
            fixedTermYears: 7,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-7-80', '7.24% p.a 7 years Fixed 80% or less LVR', 7.24, 7.29, {
            fixedTermYears: 7,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
        10: [
          rate('investment-fixed-io-10-gt80', '7.69% p.a 10 years Fixed', 7.69, 7.65, {
            fixedTermYears: 10,
            fallbackRate: 7.54,
            fallbackLabel: '7.54% p.a Standard Variable more than 80% LVR',
          }),
          rate('investment-fixed-io-10-80', '7.24% p.a 10 years Fixed 80% or less LVR', 7.24, 7.27, {
            fixedTermYears: 10,
            fallbackRate: 7.34,
            fallbackLabel: '7.34% p.a Standard Variable 80% or less LVR',
          }),
        ],
      },
    },
  },
}
