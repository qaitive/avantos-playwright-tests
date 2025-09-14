import { test as base, expect } from '@playwright/test'
import { GraphPage } from '../pages/graphPage'
import { Drawer } from '../pages/components/drawer'

interface PageObjects {
  graphPage: GraphPage
  drawer: Drawer
}

export const test = base.extend<PageObjects>({
  graphPage: async ({ page }, use) => {
    await page.goto('/')
    await use(new GraphPage(page))
  },

  drawer: async ({ page }, use) => {
    await use(new Drawer(page))
  },
})

export { expect }
