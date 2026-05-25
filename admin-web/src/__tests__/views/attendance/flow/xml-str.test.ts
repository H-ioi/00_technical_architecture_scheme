import { describe, it, expect } from 'vitest'
import { holidayFlowDefaultXml } from '../../../../views/attendance/flow/xml-str'

describe('xml-str.ts', () => {
  describe('holidayFlowDefaultXml', () => {
    it('应为合法的 XML BPMN 模板字符串', () => {
      expect(typeof holidayFlowDefaultXml).toBe('string')
      expect(holidayFlowDefaultXml.length).toBeGreaterThan(100)
    })

    it('应包含 definitions 根元素', () => {
      expect(holidayFlowDefaultXml).toContain('<definitions')
      expect(holidayFlowDefaultXml).toContain('</definitions>')
    })

    it('应包含开始事件和任务节点', () => {
      expect(holidayFlowDefaultXml).toContain('StartEvent_1y45yut')
      expect(holidayFlowDefaultXml).toContain('Task_1hcentk')
    })

    it('应包含 BPMNDiagram 可视化信息', () => {
      expect(holidayFlowDefaultXml).toContain('BpmnDiagram_1')
      expect(holidayFlowDefaultXml).toContain('BpmnPlane_1')
    })
  })
})
