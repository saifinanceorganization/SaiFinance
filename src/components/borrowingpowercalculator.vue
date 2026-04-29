<template>
  <section class="bg-white py-12 font-Arial">
    <div class="mx-auto max-w-7xl px-6 lg:px-6">
      <h1 class="mb-10 text-[20px] lg:text-[30px] font-bold lg:leading-[48px] tracking-normal text-primary">Home loan borrowing power calculator</h1>

      <!-- <div
        class="border border-[#d6dde5] bg-[#eef2f5] px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6"
      >
        <div class="max-w-[640px]">
          <p class="text-[13px] font-bold leading-5 text-[#003b70]">
            Take the first step towards applying for pre-approval by speaking to a specialist.
          </p>
          <p class="mt-1 text-[12px] leading-5 text-[#49566a]">
            Provide us with your details and one of our home loan specialists will get in touch.
            Call back time is 1 - 3 business days.
          </p>
        </div>

        <a
          class="mt-4 inline-flex min-h-[38px] items-center justify-center border border-[#0073c7] bg-[#0073c7] px-4 text-[12px] font-bold text-white transition hover:bg-[#0062aa] sm:mt-0"
          href="/contact"
        >
          Request call back
        </a>
      </div> -->

      <div class="mt-6 overflow-hidden rounded-xl bg-[#eef2f5] shadow-sm">
        <div class="grid xl:grid-cols-3 lg:grid-cols-2">
          <section class="bg-[#eef2f5] p-4 lg:p-5 lg:border-r lg:border-white/80">
            <h2 class="text-[30px] font-normal leading-none text-primary">
              Your details
            </h2>

            <div class="mt-5">
              <label :class="labelClass">
                Application type
              </label>

              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="option in applicationTypeOptions"
                  :key="option.value"
                  :aria-pressed="form.applicationType === option.value"
                  :class="getToggleClasses(form.applicationType === option.value)"
                  type="button"
                  @click="form.applicationType = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="mt-4">
              <label
                :class="labelClass"
                for="dependants"
              >
                Number of dependants
              </label>

              <select
                id="dependants"
                v-model.number="form.dependants"
                :class="selectClass"
              >
                <option
                  v-for="option in dependantOptions"
                  :key="option.label"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="mt-4">
              <label :class="labelClass">
                Property you would like to buy
              </label>

              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="option in propertyTypeOptions"
                  :key="option.value"
                  :aria-pressed="form.propertyType === option.value"
                  :class="getToggleClasses(form.propertyType === option.value)"
                  type="button"
                  @click="form.propertyType = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </section>

          <section class="bg-[#eef2f5] p-4 lg:p-5 lg:border-r lg:border-white/80">
            <h2 class="text-[30px] font-normal leading-none text-primary">
              Your earnings
            </h2>

            <div class="mt-5 space-y-4">
              <div>
                <label
                  :class="labelClass"
                  for="primary-income"
                >
                  Your annual income (before tax)
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="primary-income"
                    v-model.number="form.primaryIncome"
                    min="0"
                    step="1000"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>

              <div>
                <label
                  :class="labelClass"
                  for="primary-other-income"
                >
                  Your annual other income (optional)
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="primary-other-income"
                    v-model.number="form.primaryOtherIncome"
                    min="0"
                    step="1000"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>

              <template v-if="showJointFields">
                <div>
                  <label
                    :class="labelClass"
                    for="second-income"
                  >
                    2nd applicant&apos;s annual income (before tax)
                  </label>

                  <div :class="moneyFieldWrapperClass">
                    <span class="text-[13px] text-[#1d2c41]">$</span>
                    <input
                      id="second-income"
                      v-model.number="form.secondIncome"
                      min="0"
                      step="1000"
                      type="number"
                      inputmode="numeric"
                      :class="moneyFieldClass"
                    />
                  </div>
                </div>

                <div>
                  <label
                    :class="labelClass"
                    for="second-other-income"
                  >
                    2nd applicant&apos;s annual other income (optional)
                  </label>

                  <div :class="moneyFieldWrapperClass">
                    <span class="text-[13px] text-[#1d2c41]">$</span>
                    <input
                      id="second-other-income"
                      v-model.number="form.secondOtherIncome"
                      min="0"
                      step="1000"
                      type="number"
                      inputmode="numeric"
                      :class="moneyFieldClass"
                    />
                  </div>
                </div>
              </template>
            </div>
          </section>

          <section class="bg-[#eef2f5] p-4 sm:p-5">
            <h2 class="text-[30px] font-normal leading-none text-primary">
              Your expenses
            </h2>

            <div class="mt-5 space-y-4">
              <div>
                <label
                  :class="labelClass"
                  for="living-expenses"
                >
                  Monthly living expenses
                  <span
                    class="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7c8998] text-[9px] font-bold leading-none text-[#7c8998]"
                    title="For example: groceries, petrol, bills or utilities. Please include joint applicants expenses too."
                  >
                    i
                  </span>
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="living-expenses"
                    v-model.number="form.monthlyLivingExpenses"
                    min="0"
                    step="100"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>

              <div>
                <label
                  :class="labelClass"
                  for="current-home-loan"
                >
                  Current home loan monthly repayments
                  <span
                    class="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7c8998] text-[9px] font-bold leading-none text-[#7c8998]"
                    title="Include your current home loan repayment amount if you already have one."
                  >
                    i
                  </span>
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="current-home-loan"
                    v-model.number="form.currentHomeLoanRepayments"
                    min="0"
                    step="100"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>

              <div>
                <label
                  :class="labelClass"
                  for="other-loans"
                >
                  Other loan monthly repayments
                  <span
                    class="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7c8998] text-[9px] font-bold leading-none text-[#7c8998]"
                    title="Include car loans, personal loans, or any other regular debt repayments."
                  >
                    i
                  </span>
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="other-loans"
                    v-model.number="form.otherLoanRepayments"
                    min="0"
                    step="100"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>

              <div>
                <label
                  :class="labelClass"
                  for="other-commitments"
                >
                  Other monthly commitments
                  <span
                    class="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7c8998] text-[9px] font-bold leading-none text-[#7c8998]"
                    title="Add any regular monthly costs not already captured above."
                  >
                    i
                  </span>
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="other-commitments"
                    v-model.number="form.otherMonthlyCommitments"
                    min="0"
                    step="100"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>

              <div>
                <label
                  :class="labelClass"
                  for="credit-card-limits"
                >
                  Total credit card limits
                </label>

                <div :class="moneyFieldWrapperClass">
                  <span class="text-[13px] text-[#1d2c41]">$</span>
                  <input
                    id="credit-card-limits"
                    v-model.number="form.creditCardLimits"
                    min="0"
                    step="100"
                    type="number"
                    inputmode="numeric"
                    :class="moneyFieldClass"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="border-t border-white/80 px-4 py-8 text-center">
          <button
            class="inline-flex min-h-[42px] items-center justify-center rounded border border-primary bg-primary px-5 text-[13px] font-semibold text-white transition hover:bg-[#0f2147]/90"
            type="button"
            @click="calculateBorrowingPower"
          >
            Work out how much I could borrow
          </button>
        </div>
      </div>

      <div class="mt-8 rounded-xl bg-[#eef2f5] p-8 shadow-sm">
        <section>
          <h2 class="text-[15px] font-bold leading-5 text-primary">
            We estimate you could borrow:
          </h2>

          <div class="mt-2 text-[52px] font-semibold leading-none text-primary sm:text-[58px]">
            {{ formatCurrency(result.borrowingPower) }}
          </div>

          <button
            class="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#005b96]"
            type="button"
            @click="resetCalculator"
          >
            <span
              class="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]"
              aria-hidden="true"
            >
              &#8634;
            </span>
            Start over
          </button>

          <p
            v-if="!result.hasCalculated"
            class="mt-4 max-w-[320px] text-[12px] leading-5 text-[#49566a]"
          >
            Enter your details and select Work out how much I could borrow to generate an
            estimate.
          </p>

          <p
            v-else-if="!result.isValid"
            class="mt-4 max-w-[340px] text-[12px] leading-5 text-[#8f5d00]"
          >
            Based on the values entered, there is not enough surplus income to produce a borrowing
            estimate above $1,000.
          </p>

          <div
            v-else
            class="mt-4 space-y-1 text-[12px] leading-5 text-[#49566a]"
          >
            <p>Assessment rate used: {{ formatRate(result.assessmentRate) }}</p>
            <p>Benchmark living expenses: {{ formatCurrency(result.benchmarkLivingExpenses) }}</p>
          </div>
        </section>

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
            <a
              class="inline-flex min-h-[42px] items-center rounded justify-center border border-[#00843d] bg-[#00843d] px-5 text-[12px] font-bold text-white transition hover:bg-[#006f34]"
              href="/contact"
            >
              Apply online now
            </a>
            <a
              class="inline-flex min-h-[42px] items-center justify-center rounded border border-primary bg-white px-5 text-[12px] font-bold text-primary transition hover:bg-[#eef2f5]"
              href="/contact"
            >
              Book Free Consultation Call
            </a>
          </div>
        </section>
      </div>

      <!-- <div class="mt-6 border-y border-[#dce8ef] bg-[#eef8fd] px-4 py-3 text-[14px] leading-5 text-[#25465d]">
        <span class="font-bold">i</span>
        This estimate is based on the information you entered and is intended for illustrative
        purposes only. It uses a {{ borrowingPowerAssumptions.loanTermYears }}-year
        {{ borrowingPowerAssumptions.paymentTypeLabel.toLowerCase() }} loan, the current
        {{ selectedRateAssumption.label.toLowerCase() }}, a
        {{ borrowingPowerAssumptions.sensitivityMargin.toFixed(2) }}% assessment buffer, and
        benchmark living-expense tables.
      </div> -->

      <!-- <div class="mt-12 grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start">
        <div>
          <h2 class="text-[34px] font-normal leading-none text-[#003b70]">
            Featured rate
          </h2>
        </div>

        <article class="border border-[#d6dde5] bg-white p-5 sm:p-6">
          <h3 class="text-[32px] font-normal leading-none text-[#003b70]">
            2 year fixed rate
          </h3>

          <div class="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p class="text-[38px] font-semibold leading-none text-[#003b70] sm:text-[42px]">
                5.79% p.a.
              </p>
              <p class="mt-3 text-[12px] font-bold text-[#003b70]">
                Interest rate
              </p>
            </div>

            <div>
              <p class="text-[38px] font-semibold leading-none text-[#003b70] sm:text-[42px]">
                6.56% p.a.
              </p>
              <p class="mt-3 text-[12px] font-bold text-[#003b70]">
                Comparison rate
              </p>
            </div>
          </div>

          <div class="mt-5 h-px bg-[#d6dde5]"></div>

          <p class="mt-4 max-w-[560px] text-[12px] leading-5 text-[#49566a]">
            Discounted 2 year fixed rate when borrowing 80% or less of the property value on an
            owner occupied home loan with principal and interest repayments.
          </p>

          <div class="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              class="inline-flex min-h-[40px] items-center justify-center border border-[#0073c7] bg-[#0073c7] px-4 text-[12px] font-bold text-white transition hover:bg-[#0062aa]"
              href="/contact"
            >
              Request call back
            </a>

            <a
              class="text-[13px] font-bold text-[#005b96] underline-offset-2 hover:underline"
              href="/services/home-loan"
            >
              Fixed rate home loan
            </a>
          </div>
        </article>
      </div> -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  borrowingPowerAssumptions,
  borrowingPowerRateAssumptions,
  calculateBorrowingPowerEstimate,
  dependantOptions,
  type ApplicationType,
  type BorrowingPowerEstimate,
  type BorrowingPowerInput,
  type PropertyType,
} from '../lib/homeLoanBorrowingPowerData'

const labelClass = 'block text-gray-600 text-sm font-Inter ui-sans-serif'
const selectClass =
  'mt-2 min-h-[44px] w-full border border-[#8f99a7] bg-white px-3 text-[13px] text-[#16263f] outline-none rounded'
const moneyFieldWrapperClass =
  'mt-2 flex min-h-[44px] items-center border border-[#8f99a7] bg-white px-3 rounded'
const moneyFieldClass =
  'calc-number-input w-full border-0 bg-transparent px-2 py-2 text-[13px] text-[#16263f] outline-none'
const toggleBaseClass =
  'inline-flex min-h-[34px] items-center justify-center border px-4 text-[14px] font-bold transition'

const applicationTypeOptions: Array<{ label: string; value: ApplicationType }> = [
  { label: 'Single', value: 'single' },
  { label: 'Joint', value: 'joint' },
]

const propertyTypeOptions: Array<{ label: string; value: PropertyType }> = [
  { label: 'Home to live in', value: 'home' },
  { label: 'Residential investment', value: 'investment' },
]

const DEFAULT_FORM: BorrowingPowerInput = {
  applicationType: 'single',
  dependants: 0,
  propertyType: 'home',
  primaryIncome: 0,
  primaryOtherIncome: 0,
  secondIncome: 0,
  secondOtherIncome: 0,
  monthlyLivingExpenses: 0,
  currentHomeLoanRepayments: 0,
  otherLoanRepayments: 0,
  otherMonthlyCommitments: 0,
  creditCardLimits: 0,
}

type ResultState = BorrowingPowerEstimate & {
  hasCalculated: boolean
}

function createEmptyResult(): ResultState {
  return {
    borrowingPower: 0,
    isValid: false,
    baseProductRate: borrowingPowerRateAssumptions.home.rate,
    assessmentRate: 0,
    netAnnualIncome: 0,
    netMonthlyIncome: 0,
    benchmarkLivingExpenses: 0,
    assessedLivingExpenses: 0,
    totalMonthlyCommitments: 0,
    monthlyRepaymentCapacity: 0,
    hasCalculated: false,
  }
}

const form = reactive<BorrowingPowerInput>({ ...DEFAULT_FORM })
const result = reactive<ResultState>(createEmptyResult())

const showJointFields = computed(() => form.applicationType === 'joint')
const selectedRateAssumption = computed(() => borrowingPowerRateAssumptions[form.propertyType])

watch(
  form,
  () => {
    clearResult()
  },
  { deep: true },
)

function getToggleClasses(isActive: boolean) {
  return [
    toggleBaseClass,
    isActive
      ? 'border-[#003b70] bg-primary text-white rounded'
      : 'border-[#8f99a7] bg-white text-[#1b2a3f] hover:border-[#003b70]/60 rounded',
  ]
}

function calculateBorrowingPower() {
  Object.assign(result, calculateBorrowingPowerEstimate(form), { hasCalculated: true })
}

function clearResult() {
  Object.assign(result, createEmptyResult(), {
    baseProductRate: selectedRateAssumption.value.rate,
  })
}

function resetCalculator() {
  Object.assign(form, { ...DEFAULT_FORM })
  clearResult()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value || 0)))
}

function formatRate(value: number) {
  return `${value.toFixed(2)}% p.a.`
}
</script>

<style scoped>
.calc-number-input::-webkit-inner-spin-button,
.calc-number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.calc-number-input {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
