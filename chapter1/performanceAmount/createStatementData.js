// 공연기 계산기
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance
    this.play = aPlay
  }

  get amount() {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        throw '오류 발생'

      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`알 수 없는 장르 : ${this.play.type}`)
    }

    return result
  }

  get volumneCredits() {
    let result = 0
    // 포인트 적립
    result += Math.max(this.performance.audience - 30, 0)
    // 희극관객 5명마다 추가 포인트를 제공
    if ('comedy' == this.play.type) result += Math.floor(this.performance.audience / 5)
    return result
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }

    return result
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }
    result += 300 * this.performance.audience
    return result
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay)
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay)
    default:
      throw new Error(`알 수 없는 장르 : ${aPlay.type}`)
  }
}

// 중간 데이터 생성을 전담
export default function createStatementData(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer // 고객 데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumneCredits = calculator.volumneCredits
    return result
  }

  // renderPlainText()의 중첩함수를 statement로 옮김
  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount
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
