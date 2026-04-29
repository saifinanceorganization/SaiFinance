<template>
  <section class="py-12">
    <div class="mx-auto max-w-7xl lg:px-6 md:px-6">
      <h1 class="mb-10 text-[20px] lg:text-[30px] font-bold lg:leading-[48px] tracking-normal text-primary">
        Home loan repayment calculator
      </h1>

      <div class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div class="bg-[#eef2f5] p-8 rounded-xl shadow-sm">
          <label class="text-sm text-gray-600">Property type</label>

          <div class="mb-6 mt-2 flex flex-wrap gap-3">
            <button class="rounded border px-6 py-2" :class="form.propertyType === 'owner_occupier'
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white text-gray-700'
              " type="button" @click="form.propertyType = 'owner_occupier'">
              Owner occupier
            </button>

            <button class="rounded border px-6 py-2" :class="form.propertyType === 'investment'
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white text-gray-700'
              " type="button" @click="form.propertyType = 'investment'">
              Residential investment
            </button>
          </div>

          <label class="text-sm text-gray-600">Loan amount</label>

          <input v-model.number="form.loanAmount" type="number" min="20000" max="9900000" step="1000"
            class="mb-2 mt-2 w-full rounded border p-3" />

          <p class="mb-6 text-xs text-gray-500">
            Minimum $20,000. Maximum $9,900,000.
          </p>

          <label class="text-sm text-gray-600">Variable or fixed rate</label>

          <div class="mb-6 mt-2 flex flex-wrap gap-3">
            <button class="rounded border px-6 py-2" :class="form.rateType === 'variable'
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white text-gray-700'
              " type="button" @click="form.rateType = 'variable'">
              Variable
            </button>

            <button class="rounded border px-6 py-2" :class="form.rateType === 'fixed'
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 bg-white text-gray-700'
              " type="button" @click="form.rateType = 'fixed'">
              Fixed
            </button>
          </div>

          <label class="text-sm text-gray-600">Payment type</label>

          <select v-model="form.paymentType" class="mb-6 mt-2 w-full rounded border p-3">
            <option v-for="option in paymentTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <div class="mb-6">
            <div class="flex items-center justify-between gap-3">
              <label class="text-sm text-gray-600">
                {{ interestRateLabel }}
              </label>

              <button class="text-sm font-medium text-primary" type="button" @click="toggleCustomRate">
                {{ form.useCustomRate ? 'Choose an ANZ rate' : 'Enter my own interest rate' }}
              </button>
            </div>

            <template v-if="form.useCustomRate">
              <input v-model="form.customRate" type="number" min="0" max="30" step="0.01" placeholder="%"
                class="mt-2 w-full rounded border p-3" />

              <div v-if="showCustomFixedPeriod" class="mt-4">
                <label class="text-sm text-gray-600">Fixed period</label>

                <select v-model.number="form.customFixedTermYears" class="mt-2 w-full rounded border p-3">
                  <option v-for="year in customFixedPeriodOptions" :key="year" :value="year">
                    {{ year }} {{ year === 1 ? 'year' : 'years' }}
                  </option>
                </select>
              </div>

              <p class="mt-2 text-xs text-gray-500">
                Note: the manual interest rate you have selected may not be available.
              </p>
            </template>

            <template v-else>
              <select v-model="form.selectedRateId" class="mt-2 w-full rounded border p-3">
                <option value="">
                  Please select
                </option>

                <option v-for="option in availableRateOptions" :key="option.id" :value="option.id">
                  {{ option.label }}
                </option>
              </select>
            </template>

            <div class="mt-2 text-sm text-gray-600">
              Comparison rate:
              <span>{{ selectedComparisonRateText }}</span>
            </div>
          </div>

          <label class="text-sm text-gray-600">Loan period in years</label>

          <select v-model.number="form.loanYears" class="mb-8 mt-2 w-full rounded border p-3">
            <option v-for="year in yearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>

          <div class="flex flex-wrap gap-3">
            <button class="min-w-[220px] flex-1 rounded bg-primary py-3 font-semibold text-white" type="button"
              @click="calculate">
              Calculate my payments
            </button>

            <!-- <button
              class="rounded border border-gray-300 px-6 py-3 font-semibold text-gray-700"
              type="button"
              @click="resetCalculator"
            >
              Start over
            </button> -->
          </div>
        </div>

        <div>
          <div class="rounded-xl shadow-sm bg-[#eef2f5] p-8">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 class="text-2xl font-semibold text-primary">
                Your estimated repayments
              </h2>

              <select v-model="form.frequency" class="rounded border px-3 py-2">
                <option value="Monthly">
                  Monthly
                </option>
                <option value="Fortnightly">
                  Fortnightly
                </option>
                <option value="Weekly">
                  Weekly
                </option>
              </select>
            </div>

            <h3 class="mb-8 text-5xl font-bold text-primary">
              {{ formatCurrency(result.amount) }}
            </h3>

            <div v-if="result.transitionMessage" class="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
              {{ result.transitionMessage }}
            </div>

            <div class="space-y-4 text-gray-600">
              <div class="flex justify-between gap-4 border-b pb-2">
                <span>Interest rate</span>
                <span class="text-right">{{ result.showRate }}</span>
              </div>

              <div class="flex justify-between gap-4 border-b pb-2">
                <span>Comparison rate</span>
                <span class="text-right">{{ result.showComparisonRate }}</span>
              </div>

              <div class="flex justify-between gap-4 border-b pb-2">
                <span>Interest rate type</span>
                <span class="text-right">{{ rateTypeLabels[form.rateType] }}</span>
              </div>

              <div class="flex justify-between gap-4 border-b pb-2">
                <span>Payment type</span>
                <span class="text-right">{{ selectedPaymentTypeLabel }}</span>
              </div>

              <div v-if="showFixedPeriodRow" class="flex justify-between gap-4 border-b pb-2">
                <span>Fixed period</span>
                <span class="text-right">
                  {{ activeFixedPeriodYears }} {{ activeFixedPeriodYears === 1 ? 'year' : 'years' }}
                </span>
              </div>

              <div class="flex justify-between gap-4 border-b pb-2">
                <span>Loan period</span>
                <span class="text-right">{{ form.loanYears }} years</span>
              </div>

              <div class="flex justify-between gap-4 border-b pb-2">
                <span>Property type</span>
                <span class="text-right">{{ propertyTypeLabels[form.propertyType] }}</span>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <button
                class="rounded border border-primary px-4 py-2 font-medium text-primary disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                :disabled="!result.hasCalculated" type="button" @click="saveScenario">
                Add a new scenario
              </button>

              <button class="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700" type="button"
                @click="resetCalculator">
                Start over
              </button>
            </div>

            <div v-if="savedScenarios.length" class="mt-8 border-t pt-6">
              <h3 class="text-lg font-semibold text-primary">
                Saved comparison scenarios
              </h3>

              <div class="mt-4 grid gap-4">
                <article v-for="scenario in savedScenarios" :key="scenario.id"
                  class="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-medium text-slate-500">
                        Scenario {{ scenario.id }}
                      </p>
                      <h4 class="text-2xl font-bold text-primary">
                        {{ formatCurrency(scenario.amount) }}
                      </h4>
                      <p class="text-sm text-slate-500">
                        {{ scenario.frequency }}
                      </p>
                    </div>

                    <button class="text-sm font-medium text-slate-500" type="button"
                      @click="removeScenario(scenario.id)">
                      Remove
                    </button>
                  </div>

                  <dl class="mt-4 space-y-2 text-sm text-slate-600">
                    <div class="flex justify-between gap-4">
                      <dt>Interest rate</dt>
                      <dd class="text-right">{{ scenario.showRate }}</dd>
                    </div>

                    <div class="flex justify-between gap-4">
                      <dt>Comparison rate</dt>
                      <dd class="text-right">{{ scenario.showComparisonRate }}</dd>
                    </div>

                    <div class="flex justify-between gap-4">
                      <dt>Type</dt>
                      <dd class="text-right">{{ scenario.rateType }}</dd>
                    </div>

                    <div class="flex justify-between gap-4">
                      <dt>Payment</dt>
                      <dd class="text-right">{{ scenario.paymentType }}</dd>
                    </div>

                    <div class="flex justify-between gap-4">
                      <dt>Property</dt>
                      <dd class="text-right">{{ scenario.propertyType }}</dd>
                    </div>
                  </dl>

                  <p v-if="scenario.transitionMessage" class="mt-3 text-xs text-slate-500">
                    {{ scenario.transitionMessage }}
                  </p>
                </article>
              </div>
            </div>
          </div>
          <div class="mt-10 rounded-xl shadow-sm bg-[#eef2f5] p-8">
            <section>
              <h2 class="text-[30px] font-normal leading-none text-primary">
                What&apos;s next?
              </h2>

              <p class="mt-3 text-[12px] leading-5 text-[#24374c]">
                In under 5 minutes, you can get your application started for pre-approval, a new home
                loan, refinancing, or topping up your existing home loan.
              </p>
              <p class="mt-3 text-[12px] leading-5 text-[#24374c]">
                Tell us a bit about yourself and the loan you&apos;d like, then we&apos;ll call you
                back within 24-48 hours to help keep your application moving.
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-3">
                <a class="inline-flex min-h-[42px] items-center rounded justify-center border border-[#00843d] bg-[#00843d] px-5 text-[12px] font-bold text-white transition hover:bg-[#006f34]"
                  href="/contact">
                  Apply online now
                </a>
                <a class="inline-flex min-h-[42px] items-center justify-center rounded border border-primary bg-white px-5 text-[12px] font-bold text-primary transition hover:bg-[#eef2f5]"
                  href="/contact">
                  Book Free Consultation Call
                </a>
              </div>
            </section>
          </div>
        </div>


      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  propertyTypeLabels,
  rateTypeLabels,
  repaymentCalculatorData,
  type PaymentType,
  type PropertyType,
  type RateOption,
  type RateType,
} from '../lib/homeLoanRepaymentData'

type Frequency = 'Monthly' | 'Fortnightly' | 'Weekly'
type TransitionType = 'io' | 'fixed' | 'fixed_io' | null

type ScenarioSnapshot = {
  id: number
  amount: number
  frequency: Frequency
  showRate: string
  showComparisonRate: string
  rateType: string
  paymentType: string
  propertyType: string
  transitionMessage: string
}

type ResolvedRateContext = {
  rate: number
  comparisonRate: number
  displayRateLabel: string
  fallbackRate: number | null
  fallbackLabel: string | null
  specialPeriodYears: number | null
  fixedPeriodYears: number | null
  transitionType: TransitionType
}

const DEFAULT_FORM = {
  propertyType: 'owner_occupier' as PropertyType,
  loanAmount: 500000,
  rateType: 'variable' as RateType,
  paymentType: 'pi' as PaymentType,
  selectedRateId: '',
  loanYears: 30,
  frequency: 'Monthly' as Frequency,
  useCustomRate: false,
  customRate: '',
  customFixedTermYears: 1,
}

const form = reactive({ ...DEFAULT_FORM })

const result = reactive({
  amount: 0,
  showRate: '-%',
  showComparisonRate: '-%',
  transitionMessage: '',
  hasCalculated: false,
  fixedPeriodYears: null as number | null,
})

const savedScenarios = ref<ScenarioSnapshot[]>([])
const nextScenarioId = ref(1)

const yearOptions = Array.from({ length: 30 }, (_, index) => index + 1)

const paymentTypeOptions = computed(() => repaymentCalculatorData[form.propertyType].paymentTypes)

const selectedPaymentTypeOption = computed(() => {
  return paymentTypeOptions.value.find((option) => option.value === form.paymentType) || paymentTypeOptions.value[0]
})

const selectedPaymentTypeLabel = computed(() => selectedPaymentTypeOption.value?.label || '-')

const interestOnlyYears = computed(() => selectedPaymentTypeOption.value?.interestOnlyYears ?? null)

const customFixedPeriodOptions = computed(() => repaymentCalculatorData[form.propertyType].fixed.customPeriods)

const showCustomFixedPeriod = computed(() => {
  return form.useCustomRate && form.rateType === 'fixed' && form.paymentType === 'pi'
})

const availableRateOptions = computed<RateOption[]>(() => {
  const config = repaymentCalculatorData[form.propertyType]

  if (form.rateType === 'variable') {
    return form.paymentType === 'pi' ? config.variable.pi : config.variable.io
  }

  if (form.paymentType === 'pi') {
    return config.fixed.pi
  }

  return config.fixed.io[interestOnlyYears.value || 0] || []
})

const selectedRateOption = computed(() => {
  return availableRateOptions.value.find((option) => option.id === form.selectedRateId) || null
})

const selectedComparisonRateText = computed(() => {
  if (form.useCustomRate) {
    const value = parseRateInput(form.customRate)
    return value ? formatRate(value) : '-%'
  }

  return selectedRateOption.value ? formatRate(selectedRateOption.value.comparisonRate) : '-%'
})

const interestRateLabel = computed(() => {
  if (!form.useCustomRate) {
    return 'Interest rate'
  }

  if (form.rateType === 'fixed' && form.paymentType === 'pi') {
    return 'Custom fixed rate'
  }

  return 'Custom interest rate'
})

const activeFixedPeriodYears = computed(() => {
  if (result.fixedPeriodYears) {
    return result.fixedPeriodYears
  }

  if (form.rateType !== 'fixed') {
    return null
  }

  if (form.paymentType !== 'pi') {
    return interestOnlyYears.value
  }

  if (form.useCustomRate) {
    return form.customFixedTermYears
  }

  return selectedRateOption.value?.fixedTermYears || null
})

const showFixedPeriodRow = computed(() => {
  return form.rateType === 'fixed' && !!activeFixedPeriodYears.value
})

watch(
  () => form.propertyType,
  () => {
    ensurePaymentTypeIsValid()
    ensureCustomFixedTermIsValid()
    form.selectedRateId = ''
    clearCalculation()
  },
)

watch(
  () => form.rateType,
  () => {
    form.selectedRateId = ''
    clearCalculation()
  },
)

watch(
  () => form.paymentType,
  () => {
    form.selectedRateId = ''
    clearCalculation()
  },
)

watch(
  () => form.useCustomRate,
  (isCustom) => {
    if (isCustom) {
      form.selectedRateId = ''
    } else {
      form.customRate = ''
    }

    clearCalculation()
  },
)

watch(
  () => form.selectedRateId,
  () => {
    clearCalculation()
  },
)

watch(
  () => form.customRate,
  () => {
    if (form.useCustomRate) {
      clearCalculation()
    }
  },
)

watch(
  () => form.customFixedTermYears,
  () => {
    if (showCustomFixedPeriod.value) {
      clearCalculation()
    }
  },
)

watch(
  () => form.loanAmount,
  () => {
    clearCalculation()
  },
)

watch(
  () => form.loanYears,
  () => {
    clearCalculation()
  },
)

watch(
  () => form.frequency,
  () => {
    if (result.hasCalculated) {
      calculate()
    }
  },
)

function ensurePaymentTypeIsValid() {
  const validValues = new Set(paymentTypeOptions.value.map((option) => option.value))

  if (!validValues.has(form.paymentType)) {
    form.paymentType = 'pi'
  }
}

function ensureCustomFixedTermIsValid() {
  if (!customFixedPeriodOptions.value.includes(form.customFixedTermYears)) {
    form.customFixedTermYears = customFixedPeriodOptions.value[0]
  }
}

function toggleCustomRate() {
  form.useCustomRate = !form.useCustomRate
}

function resetCalculator() {
  Object.assign(form, {
    ...DEFAULT_FORM,
    customFixedTermYears: repaymentCalculatorData.owner_occupier.fixed.customPeriods[0],
  })

  savedScenarios.value = []
  nextScenarioId.value = 1
  clearCalculation()
}

function clearCalculation() {
  result.amount = 0
  result.showRate = '-%'
  result.showComparisonRate = '-%'
  result.transitionMessage = ''
  result.hasCalculated = false
  result.fixedPeriodYears = null
}

function saveScenario() {
  if (!result.hasCalculated) {
    return
  }

  savedScenarios.value = [
    {
      id: nextScenarioId.value,
      amount: result.amount,
      frequency: form.frequency,
      showRate: result.showRate,
      showComparisonRate: result.showComparisonRate,
      rateType: rateTypeLabels[form.rateType],
      paymentType: selectedPaymentTypeLabel.value,
      propertyType: propertyTypeLabels[form.propertyType],
      transitionMessage: result.transitionMessage,
    },
    ...savedScenarios.value,
  ].slice(0, 3)

  nextScenarioId.value += 1
}

function removeScenario(id: number) {
  savedScenarios.value = savedScenarios.value.filter((scenario) => scenario.id !== id)
}

function calculate() {
  const loan = Number(form.loanAmount || 0)
  const years = Number(form.loanYears || 0)
  const rateContext = resolveRateContext()

  if (!loan || !years || !rateContext) {
    clearCalculation()
    return
  }

  const totalMonths = years * 12
  const monthlyPayment =
    form.paymentType === 'pi'
      ? calculateAmortizedPayment(loan, rateContext.rate, totalMonths)
      : calculateInterestOnlyPayment(loan, rateContext.rate)

  result.amount = applyFrequency(monthlyPayment)
  result.showRate = rateContext.displayRateLabel
  result.showComparisonRate = formatRate(rateContext.comparisonRate)
  result.transitionMessage = buildTransitionMessage(loan, years, rateContext)
  result.hasCalculated = true
  result.fixedPeriodYears = rateContext.fixedPeriodYears
}

function resolveRateContext(): ResolvedRateContext | null {
  if (form.useCustomRate) {
    const customRate = parseRateInput(form.customRate)

    if (!customRate) {
      return null
    }

    const customLabel = `${formatRate(customRate)} Custom rate`

    if (form.rateType === 'variable' && form.paymentType === 'pi') {
      return {
        rate: customRate,
        comparisonRate: customRate,
        displayRateLabel: customLabel,
        fallbackRate: null,
        fallbackLabel: null,
        specialPeriodYears: null,
        fixedPeriodYears: null,
        transitionType: null,
      }
    }

    const fallback = getNearestStandardVariableFallback(form.propertyType, customRate)
    const specialPeriodYears =
      form.rateType === 'fixed' && form.paymentType === 'pi'
        ? form.customFixedTermYears
        : interestOnlyYears.value

    return {
      rate: customRate,
      comparisonRate: customRate,
      displayRateLabel: customLabel,
      fallbackRate: fallback.rate,
      fallbackLabel: fallback.label,
      specialPeriodYears,
      fixedPeriodYears: form.rateType === 'fixed' ? specialPeriodYears : null,
      transitionType:
        form.rateType === 'fixed'
          ? form.paymentType === 'pi'
            ? 'fixed'
            : 'fixed_io'
          : 'io',
    }
  }

  if (!selectedRateOption.value) {
    return null
  }

  const selected = selectedRateOption.value

  if (form.rateType === 'variable' && form.paymentType === 'pi') {
    return {
      rate: selected.rate,
      comparisonRate: selected.comparisonRate,
      displayRateLabel: selected.label,
      fallbackRate: null,
      fallbackLabel: null,
      specialPeriodYears: null,
      fixedPeriodYears: null,
      transitionType: null,
    }
  }

  if (form.rateType === 'variable') {
    return {
      rate: selected.rate,
      comparisonRate: selected.comparisonRate,
      displayRateLabel: selected.label,
      fallbackRate: selected.fallbackRate || null,
      fallbackLabel: selected.fallbackLabel || null,
      specialPeriodYears: interestOnlyYears.value,
      fixedPeriodYears: null,
      transitionType: 'io',
    }
  }

  if (form.paymentType === 'pi') {
    return {
      rate: selected.rate,
      comparisonRate: selected.comparisonRate,
      displayRateLabel: selected.label,
      fallbackRate: selected.fallbackRate || null,
      fallbackLabel: selected.fallbackLabel || null,
      specialPeriodYears: selected.fixedTermYears || null,
      fixedPeriodYears: selected.fixedTermYears || null,
      transitionType: 'fixed',
    }
  }

  return {
    rate: selected.rate,
    comparisonRate: selected.comparisonRate,
    displayRateLabel: selected.label,
    fallbackRate: selected.fallbackRate || null,
    fallbackLabel: selected.fallbackLabel || null,
    specialPeriodYears: interestOnlyYears.value,
    fixedPeriodYears: interestOnlyYears.value,
    transitionType: 'fixed_io',
  }
}

function buildTransitionMessage(loan: number, totalYears: number, rateContext: ResolvedRateContext) {
  if (
    !rateContext.transitionType ||
    !rateContext.specialPeriodYears ||
    !rateContext.fallbackRate ||
    totalYears <= rateContext.specialPeriodYears
  ) {
    return ''
  }

  const remainingMonths = (totalYears - rateContext.specialPeriodYears) * 12

  if (remainingMonths <= 0) {
    return ''
  }

  let remainingMonthlyPayment = 0

  if (rateContext.transitionType === 'fixed') {
    const monthlyPayment = calculateAmortizedPayment(loan, rateContext.rate, totalYears * 12)
    const balance = remainingBalanceAfterPayments(
      loan,
      rateContext.rate,
      monthlyPayment,
      rateContext.specialPeriodYears * 12,
    )

    remainingMonthlyPayment = calculateAmortizedPayment(balance, rateContext.fallbackRate, remainingMonths)
  } else {
    remainingMonthlyPayment = calculateAmortizedPayment(loan, rateContext.fallbackRate, remainingMonths)
  }

  const displayPayment = applyFrequency(remainingMonthlyPayment)

  if (rateContext.transitionType === 'fixed') {
    return `After the ${rateContext.specialPeriodYears} year fixed period ends, based on current rates (which may change) your estimated payments will be ${formatCurrency(displayPayment)} ${frequencyLabel()} over the remaining loan term.`
  }

  if (rateContext.transitionType === 'fixed_io') {
    return `After the ${rateContext.specialPeriodYears} year fixed rate interest only period ends, based on current rates (which may change) your estimated payments will be ${formatCurrency(displayPayment)} ${frequencyLabel()} over the remaining loan term.`
  }

  return `After the ${rateContext.specialPeriodYears} year interest only period ends, based on current rates (which may change) your estimated payments will be ${formatCurrency(displayPayment)} ${frequencyLabel()} over the remaining loan term.`
}

function calculateInterestOnlyPayment(loan: number, annualRate: number) {
  return loan * (annualRate / 100 / 12)
}

function calculateAmortizedPayment(principal: number, annualRate: number, months: number) {
  if (months <= 0) {
    return 0
  }

  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) {
    return principal / months
  }

  const factor = Math.pow(1 + monthlyRate, months)
  return (principal * monthlyRate * factor) / (factor - 1)
}

function remainingBalanceAfterPayments(
  principal: number,
  annualRate: number,
  payment: number,
  paymentsMade: number,
) {
  const monthlyRate = annualRate / 100 / 12

  if (monthlyRate === 0) {
    return Math.max(0, principal - payment * paymentsMade)
  }

  const factor = Math.pow(1 + monthlyRate, paymentsMade)
  return Math.max(0, principal * factor - payment * ((factor - 1) / monthlyRate))
}

function getNearestStandardVariableFallback(propertyType: PropertyType, customRate: number) {
  const candidates = repaymentCalculatorData[propertyType].variable.pi.slice(0, 2)

  return candidates.reduce((closest, current) => {
    const currentDelta = Math.abs(current.rate - customRate)
    const closestDelta = Math.abs(closest.rate - customRate)
    return currentDelta < closestDelta ? current : closest
  })
}

function parseRateInput(value: string | number) {
  const parsed = Number.parseFloat(String(value))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function applyFrequency(monthlyPayment: number) {
  if (form.frequency === 'Weekly') {
    return monthlyPayment * (12 / 52)
  }

  if (form.frequency === 'Fortnightly') {
    return monthlyPayment * (12 / 26)
  }

  return monthlyPayment
}

function frequencyLabel() {
  if (form.frequency === 'Weekly') {
    return 'per week'
  }

  if (form.frequency === 'Fortnightly') {
    return 'per fortnight'
  }

  return 'per month'
}

function formatCurrency(value: number) {
  const roundedToCents = Math.round(Math.max(0, Number(value || 0)) * 100) / 100
  const displayValue = Math.ceil(roundedToCents)

  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(displayValue)
}

function formatRate(value: number) {
  return `${value.toFixed(2)}% p.a`
}
</script>
