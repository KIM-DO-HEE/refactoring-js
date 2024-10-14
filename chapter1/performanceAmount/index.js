/*
 * 연극을 외주로 받아서 공연하는 극단
 * 공연 요청이 들어오면, 연극의 장르, 관객 규모를 기초로 비용을 책정
 * 연극 장르 : 희극, 비극
 * 포인트를 지급 => 다음번 의뢰 시 공연료 할인 가능
 */

import { statement } from './invoice.js'
import plays from './plays.json' assert { type: 'json' }
import invoices from './invoices.json' assert { type: 'json' }

console.log(statement(invoices, plays))
