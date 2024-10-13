// 공연료 청구서 출력
export function statement(invoice, plays) {
  let totalAmount = 0
  let volumneCredits = 0

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }

  let result = `청구 내역 (고객명) : ${invoice.customer} \n`

  function amountFor(aPerformance) {
    let result = 0
    switch (playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`)
    }

    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function volumneCreditsFor(aPerformance) {
    let volumneCredits = 0
    // 포인트 적립
    volumneCredits += Math.max(aPerformance.audience - 30, 0)
    // 희극관객 5명마다 추가 포인트를 제공
    if ('comedy' == playFor(aPerformance).type)
      volumneCredits += Math.floor(aPerformance.audience / 5)
    return volumneCredits
  }

  for (let perf of invoice.performances) {
    volumneCredits += volumneCreditsFor(perf)
    // 청구내역 출력
    result += `${playFor(perf).name} : ${usd(amountFor(perf))} (${perf.audience}석)\n`
    totalAmount += amountFor(perf)
  }

  result += `총액: ${usd(totalAmount)}\n`
  result += `적립 포인트: ${volumneCredits}점\n`

  return result
}
