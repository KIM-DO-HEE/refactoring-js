export function statement(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformance)
  return renderPlainText(statementData, plays) // 중간 데이터 구조를 인수로 전달

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(result)
    return result
  }

  // renderPlainText()의 중첩함수를 statement로 옮김
  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

// 공연료 청구서 출력
export function renderPlainText(data, plays) {
  // 중간 데이터 구조를 인수로 전달
  let result = `청구 내역 (고객명) : ${data.customer} \n`
  for (let perf of data.performances) {
    // 청구내역 출력
    result += `${perf.play.name} : ${usd(amountFor(perf))} (${perf.audience}석)\n`
  }
  result += `총액: ${usd(totalAmount())}\n`
  result += `적립 포인트: ${totalVolumeCredits()}점\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
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

  function totalAmount() {
    let result = 0
    for (let perf of data.performances) {
      result += amountFor(perf)
    }

    return result
  }

  function totalVolumeCredits() {
    let result = 0 // 변수 선언(초기화)을 반복문 앞으로 이동 : 문장 슬라이드
    // 값 누적 로직을 별도 for로 분리
    for (let perf of data.performances) {
      result += volumneCreditsFor(perf)
    }

    return result
  }
}
