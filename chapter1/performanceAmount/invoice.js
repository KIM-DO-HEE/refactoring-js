// 공연료 청구서 출력
export function statement(invoice, plays) {
  let totalAmount = 0
  let volumneCredits = 0

  let result = `청구 내역 (고객명) : ${invoice.customer} \n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format

  function amountFor(aPerformance, play) {
    let result = 0
    switch (play.type) {
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
        throw new Error(`알 수 없는 장르 : ${play.type}`)
    }

    return result
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  for (let perf of invoice.performances) {
    let thisAmount = amountFor(perf, playFor(perf)) // play 같은 경우 perf를 통해 얻을 수 있으므로 play 매개변수를 제거해도 된다

    // 포인트 적립
    volumneCredits += Math.max(perf.audience - 30, 0)

    // 희극관객 5명마다 추가 포인트를 제공
    if ('comedy' == play.type) volumneCredits += Math.floor(perf.audience / 5)

    // 청구내역 출력
    result += `${play.name} : ${format(thisAmount / 100)} (${perf.audience}석)\n`
    totalAmount += thisAmount
  }

  result += `총액: ${format(totalAmount / 100)}\n`
  result += `적립 포인트: ${volumneCredits}점\n`

  return result
}
