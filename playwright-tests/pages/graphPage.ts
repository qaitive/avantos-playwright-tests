import { BasePage } from './basePage'
import { Locator, Page } from '@playwright/test'

export class GraphPage extends BasePage {
  readonly container: Locator
  readonly nodes: Locator
  readonly edges: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.locator('.react-flow') // main graph wrapper
    this.nodes = page.locator('.react-flow__node') // node elements
    this.edges = page.locator('.react-flow__edge') // edge paths
  }

  async viewGraph() {
    await this.container.waitFor({ state: 'visible' })
    await this.nodes.first().waitFor({ state: 'visible' })
  }

  async clickNode(index = 0) {
    await this.nodes.nth(index).click()
  }
}
