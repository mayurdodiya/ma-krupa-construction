/**
 * Pure financial maths for the EMI and ROI calculators.
 * No React, no formatting -- callers format. Kept pure so the numbers are
 * easy to reason about and to unit test later if the client asks.
 */

/* ── EMI ──────────────────────────────────────────────────────────────── */

/**
 * Standard reducing-balance EMI.
 *   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where r is the MONTHLY rate and n the number of months.
 * A zero interest rate degenerates to a straight principal split, which the
 * formula above cannot express (it divides by zero), so it is handled first.
 */
export function calculateEmi({ principal, annualRate, tenureYears }) {
  const p = Math.max(0, Number(principal) || 0);
  const n = Math.max(1, Math.round((Number(tenureYears) || 0) * 12));
  const r = (Number(annualRate) || 0) / 12 / 100;

  if (p === 0) return { emi: 0, totalPayable: 0, totalInterest: 0, principal: 0, months: n };
  if (r === 0) {
    const emi = p / n;
    return { emi, totalPayable: p, totalInterest: 0, principal: p, months: n };
  }

  const factor = Math.pow(1 + r, n);
  const emi = (p * r * factor) / (factor - 1);
  const totalPayable = emi * n;

  return { emi, totalPayable, totalInterest: totalPayable - p, principal: p, months: n };
}

/**
 * Year-by-year amortisation. Interest is charged on the opening balance each
 * month, so the split is computed monthly and then rolled up per year --
 * computing it annually would overstate interest in the early years.
 */
export function amortisationByYear({ principal, annualRate, tenureYears }) {
  const { emi, months } = calculateEmi({ principal, annualRate, tenureYears });
  const r = (Number(annualRate) || 0) / 12 / 100;
  let balance = Math.max(0, Number(principal) || 0);

  const years = [];
  let yearInterest = 0;
  let yearPrincipal = 0;

  for (let m = 1; m <= months; m += 1) {
    const interest = balance * r;
    // Final instalment absorbs the rounding drift so the balance lands on zero.
    const principalPart = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalPart);
    yearInterest += interest;
    yearPrincipal += principalPart;

    if (m % 12 === 0 || m === months) {
      years.push({
        year: Math.ceil(m / 12),
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        totalPaid: yearPrincipal + yearInterest,
        balance,
      });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  return years;
}

/* ── ROI ──────────────────────────────────────────────────────────────── */

/**
 * Projects rental income and capital appreciation over a holding period.
 *
 * Rent escalates annually (typical of a 3-year lease with a step-up clause),
 * occupancy discounts for vacancy between tenants, and holding costs are taken
 * as a percentage of the CURRENT property value rather than the purchase price
 * -- maintenance and property tax both track value, not what you once paid.
 * Income tax on rent is deliberately not modelled; it is buyer-specific.
 */
export function calculateRoi({
  investment,
  areaSqft,
  rentPerSqftMonth,
  appreciationRate,
  holdingYears,
  annualCostsPercent = 0,
  occupancyPercent = 100,
  rentEscalationPercent = 0,
}) {
  const invested = Math.max(0, Number(investment) || 0);
  const area = Math.max(0, Number(areaSqft) || 0);
  const baseRent = Math.max(0, Number(rentPerSqftMonth) || 0);
  const appr = (Number(appreciationRate) || 0) / 100;
  const years = Math.max(1, Math.round(Number(holdingYears) || 1));
  const costRate = (Number(annualCostsPercent) || 0) / 100;
  const occupancy = Math.min(1, Math.max(0, (Number(occupancyPercent) || 0) / 100));
  const escalation = (Number(rentEscalationPercent) || 0) / 100;

  const schedule = [];
  let cumulativeNetRent = 0;

  for (let y = 1; y <= years; y += 1) {
    const rentThisYear = baseRent * Math.pow(1 + escalation, y - 1);
    const grossRent = area * rentThisYear * 12 * occupancy;
    const propertyValue = invested * Math.pow(1 + appr, y);
    const costs = propertyValue * costRate;
    const netRent = grossRent - costs;
    cumulativeNetRent += netRent;

    schedule.push({
      year: y,
      grossRent,
      costs,
      netRent,
      cumulativeNetRent,
      propertyValue,
      // Total wealth if you sold at the end of this year.
      totalValue: propertyValue + cumulativeNetRent,
    });
  }

  const exitValue = invested * Math.pow(1 + appr, years);
  const capitalGain = exitValue - invested;
  const totalReturn = capitalGain + cumulativeNetRent;
  const finalValue = invested + totalReturn;

  const firstYear = schedule[0] ?? { grossRent: 0, netRent: 0 };
  const grossYield = invested > 0 ? (firstYear.grossRent / invested) * 100 : 0;
  const netYield = invested > 0 ? (firstYear.netRent / invested) * 100 : 0;

  // CAGR on total wealth (rent reinvested at zero return, deliberately conservative).
  const cagr = invested > 0 && finalValue > 0 ? (Math.pow(finalValue / invested, 1 / years) - 1) * 100 : 0;

  return {
    invested,
    years,
    schedule,
    exitValue,
    capitalGain,
    totalRentIncome: cumulativeNetRent,
    totalReturn,
    finalValue,
    totalReturnPercent: invested > 0 ? (totalReturn / invested) * 100 : 0,
    grossYield,
    netYield,
    cagr,
    monthlyRentYear1: area * baseRent * occupancy,
  };
}
