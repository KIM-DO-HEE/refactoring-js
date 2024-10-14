// 중간 데이터 생성을 전담
export default function createStatementData(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    result.amount = amountFor(result)
    result.volumneCredits = volumneCreditsFor(result)
    return result
  }

  // renderPlainText()의 중첩함수를 statement로 옮김
  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    let result = 0
    switch (aPerformance.play.type) {
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
        throw new Error(`알 수 없는 장르 : ${aPerformance.play.type}`)
    }

    return result
  }

  function volumneCreditsFor(aPerformance) {
    let volumneCredits = 0
    // 포인트 적립
    volumneCredits += Math.max(aPerformance.audience - 30, 0)
    // 희극관객 5명마다 추가 포인트를 제공
    if ('comedy' == aPerformance.play.type) volumneCredits += Math.floor(aPerformance.audience / 5)
    return volumneCredits
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumneCredits, 0)
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }
}
