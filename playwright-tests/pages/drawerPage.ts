import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './basePage'

// Interface representing a field with its label and Locator
export interface Field {
  label: string
  locator: Locator
}

// Drawer component class extending BasePage
export class Drawer extends BasePage {
  readonly drawer: Locator
  readonly selectMappingButton: Locator
  readonly closeDrawerButton: Locator
  readonly backButton: Locator
  readonly listOfPrefilledFields: Locator
  readonly listOfMappingFields: Locator
  readonly prefillText: Locator

  constructor(page: Page) {
    super(page)
    this.drawer = page.locator('[role="dialog"]')
    this.selectMappingButton = page.getByRole('button', { name: 'Select' })
    this.closeDrawerButton = page.getByRole('button', { name: 'Close' })
    this.backButton = page.getByRole('button', { name: 'Back' })
    this.listOfPrefilledFields = page.locator('li > button[type="button"]') // Prefilled fields
    this.listOfMappingFields = page.locator('//button[@data-slot="trigger"]') // Mapping fields
    // Text showing currently selected prefill mapping for selected node
    this.prefillText = page.locator('//p[starts-with(normalize-space(.), "Select mapping for")]')
  }

  /**
   * Get all fields from a given locator and return as Field[] array
   */
  async getFields(locator: Locator): Promise<Field[]> {
    const elements = locator
    const count = await elements.count()
    const fields: Field[] = []

    for (let i = 0; i < count; i++) {
      const el = elements.nth(i)
      const label = (await el.innerText()).trim() // Get field label
      fields.push({ label, locator: el })
    }
    return fields
  }

  /**
   * Click a prefill field. Randomly selects one if index is not provided.
   */
  async selectPrefillField(index?: number): Promise<any> {
    const fields = await this.getFields(this.listOfPrefilledFields)
    if (fields.length === 0) return fields

    const indexToClick =
      index !== undefined && index >= 0 && index < fields.length ? index : Math.floor(Math.random() * fields.length)

    await fields[indexToClick].locator.click()
    return { fields, indexToClick }
  }

  /**
   * Mapping flow function
   */
  async selectMapping(index?: number): Promise<any> {
    const fields = await this.getFields(this.listOfMappingFields)
    if (fields.length === 0) return fields

    const indexToClick =
      index !== undefined && index >= 0 && index < fields.length ? index : Math.floor(Math.random() * fields.length)

    await fields[indexToClick].locator.click()

    // Get prefill text and extract field label
    const prefillText = await this.prefillText.innerText()
    const match = prefillText.match(/for\s+(\w+)/)
    const prefillFieldLabel = match ? match[1] : null

    // Randomly pick one of the prefilled fields to complete mapping
    const mappedFields = await this.getFields(this.listOfPrefilledFields)
    const mappedIndexToClick = Math.floor(Math.random() * mappedFields.length)

    // Build full label for mapping
    const fullLabel =
      prefillFieldLabel + ':' + ' ' + fields[indexToClick].label + '.' + mappedFields[mappedIndexToClick].label

    await mappedFields[mappedIndexToClick].locator.click()

    return { fullLabel, indexToClick, fields }
  }

  /**
   * Wait for the drawer to be visible
   */
  async waitForOpen(): Promise<void> {
    await this.drawer.waitFor({ state: 'visible' })
  }

  /**
   * Verify that all expected fields are visible inside the drawer
   */
  async expectDrawerShowsFields(expectedFields: string[]) {
    for (const field of expectedFields) {
      const fieldLocator = this.page.getByRole('button', { name: field })
      await expect(fieldLocator).toBeVisible()
    }
  }

  /**
   * Click a specific field to map by its name
   */
  async selectFieldToMap(fieldName: string): Promise<void> {
    await this.page.getByRole('button', { name: fieldName }).click()
  }

  /**
   * Confirm mapping by clicking the "Select" button
   */
  async confirmMapping(): Promise<void> {
    const selectButton = this.drawer.getByRole('button', { name: 'Select', exact: true })
    await selectButton.waitFor({ state: 'visible' })
    await selectButton.click()
  }

  /**
   * Get text from a list item containing a button with the given fieldName
   */
  async getElementText(fieldName: string): Promise<string | null> {
    const element = this.page.getByRole('listitem').filter({ hasText: fieldName })
    await expect(element).toBeVisible({ timeout: 5000 })
    return element.innerText()
  }

  /**
   * Click a list item button and return the text of another element
   */
  async clickAndGetElementText(fieldName: string, initalFieldName: string): Promise<string | null> {
    await this.page.getByRole('listitem').filter({ hasText: fieldName }).getByRole('button').click()
    return this.getElementText(initalFieldName)
  }

  /**
   * Close the drawer by clicking the Close button
   */
  async closeDrawer(): Promise<void> {
    await this.closeDrawerButton.first().click()
  }
}
