import { test, expect } from '../fixtures/baseFixtures'
import { testData } from '../fixtures/testData'

test('Validate “View graph, open drawer, map fields, manage mappings', async ({ graphPage, drawer }) => {
  const nodeCount = await graphPage.nodes.count()

  await test.step("Verify graph of connected nodes and edges is visible'", async () => {
    await graphPage.viewGraph()
    await expect(graphPage.container).toBeVisible()
    expect(nodeCount).toBeGreaterThan(0)
    const edgeCount = await graphPage.edges.count()
    expect(edgeCount).toBeGreaterThan(0)
  })

  for (let i = 0; i < nodeCount; i++) {
    await test.step(`Verify field-to-extendedField mapping for each node ${i}`, async () => {
      await graphPage.clickNode(i)
      await drawer.waitForOpen()
      await drawer.expectDrawerShowsFields(testData.expectedPrefillFields)

      // Select prefill fields and mapping for selected prefill filed and node
      const { indexToClick: prefillindex, fields: prefillFields } = await drawer.selectPrefillField()
      const { fullLabel: fullLabel, indexToClick: index, fields: mappingFields } = await drawer.selectMapping()

      await drawer.confirmMapping()

      // Verify mapping exists
      const extendedFiledtext = await drawer.getElementText(fullLabel)
      expect(extendedFiledtext).toBe(fullLabel)

      // Reset and verify mapping removed
      const extendedFiledtextAfterReset = await drawer.clickAndGetElementText(
        fullLabel,
        prefillFields[prefillindex].label
      )
      expect(extendedFiledtextAfterReset).not.toContain(mappingFields[index].label)

      // Close drawer and verify if graph is visible
      await drawer.closeDrawer()
      await expect(graphPage.container).toBeVisible()
    })
  }
})
