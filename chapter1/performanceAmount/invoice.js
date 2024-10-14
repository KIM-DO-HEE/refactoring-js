import createStatementData from './createStatementData.js'

export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays)) // 중간 데이터 구조를 인수로 전달
}

// 공연료 청구서 출력
export function renderPlainText(data, plays) {
  // 중간 데이터 구조를 인수로 전달
  let result = `청구 내역 (고객명) : ${data.customer} \n`
  for (let perf of data.performances) {
    // 청구내역 출력
    result += `${perf.play.name} : ${usd(perf.amount)} (${perf.audience}석)\n`
  }
  result += `총액: ${usd(data.totalAmount)}\n`
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays))
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명) : ${data.customer} </h1>\n`

  result += '<table>\n'
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>'
  for (let perf of data.performances) {
    // 청구내역 출력
    result += `<tr><td>${perf.play.name} </td><td> (${perf.audience}석)</td>`
    result += `<td> ${usd(perf.amount)}</td></tr>\n`
  }
  result += '</table>'
  result += `총액: <em>${usd(data.totalAmount)}</em></p>\n`
  result += `적립 포인트: <em>${data.totalVolumeCredits}점</em>\n`
  return result

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100)
  }
}
