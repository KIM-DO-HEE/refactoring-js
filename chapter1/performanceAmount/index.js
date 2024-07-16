/*
 * 연극을 외주로 받아서 공연하는 극단
 * 공연 요청이 들어오면, 연극의 장르, 관객 규모를 기초로 비용을 책정
 * 연극 장르 : 희극, 비극
 * 포인트를 지급 => 다음번 의뢰 시 공연료 할인 가능
 */

// 공연료 청구서 출력
function statement(invoice, plays) {
  let totalAmount = 0
  let volumneCredits = 0

  let result = `청구 내역 (고객명) : ${invoice.customer} \n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format

  for (let perf of invoice.performances) {
    const play = plays[perf.playId]

    let thisAmount = amountFor(play)

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

function amountFor(perf, play) {
  let result = 0
  switch (play.type) {
    case 'tragedy':
      result = 40000
      if (perf.audience > 30) {
        result += 1000 * (perf.audience - 30)
      }
      break
    case 'comedy':
      result = 30000
      if (perf.audience > 20) {
        result += 10000 + 500 * (perf.audience - 20)
      }
      result += 300 * perf.audience
      break
    default:
      throw new Error(`알 수 없는 장르 : ${play.type}`)
  }

  return result
}
