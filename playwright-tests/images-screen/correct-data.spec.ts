import test, { expect } from 'playwright/test';
import { checkTableHeaders, openImagesScreen } from '../helpers';

const imagesSampleSkus = [
  '112382028',
  '110270045',
  '165702004C0060',
  '172547022D1000',
  'C115648',
  '110707010',
  '172547006C0050',
  '120305010',
  '165702004C0100',
  '120182012',
  '165702004',
  '112161004',
  '120729003',
  '165709029',
  '165702004S0300',
  'C120133',
  'C96028',
  '110707010D0400',
  '165702004D0500',
  '165702004S0500',
  '160063018S0500',
  '165702004D1000',
  '172572025D0500',
  '112529002',
  '110226014',
  '112611029',
  'C119296',
  '122314008',
  'C116060',
  '172192012S0500',
];

const defaultColumns = [
  'key',
  'sku',
  'product_name',
  'type',
  'product_type_key',
  'product_type_name',
  'categories',
  'selections',
];

const buildWithImageColumns = (total: number) => {
  const imageCols = Array.from({ length: total }, (_, i) => [
    `images.${i}.name`,
    `images.${i}.link`,
  ]).flat();
  return [...defaultColumns, ...imageCols];
};

test('correct columns shown in table', async ({ page }) => {
  await openImagesScreen(page);

  //search by skus
  await page
    .locator('div')
    .filter({ hasText: /^All Columns$/ })
    .nth(4)
    .click();
  await page.getByRole('option', { name: 'SKU' }).click();
  await page.getByTestId('selectable-input').fill(imagesSampleSkus.join(', '));
  console.log(imagesSampleSkus.join(', '));
  await page.getByRole('switch', { name: 'Exact Match' }).click();
  await page.getByRole('button', { name: 'search-button' }).click();

  //check total results
  const results = await page.getByText('results').textContent();
  await expect(results).toEqual(`${imagesSampleSkus.length} results`);

  await checkTableHeaders(page, buildWithImageColumns(4));

  await page.locator('button[name="nextPage"]').click();

  await checkTableHeaders(page, buildWithImageColumns(5));
});

test('correct data shown in table', async ({ page }) => {
  await openImagesScreen(page);
  //search by skus
  await page
    .locator('div')
    .filter({ hasText: /^All Columns$/ })
    .nth(4)
    .click();
  await page.getByRole('option', { name: 'SKU' }).click();
  await page.getByTestId('selectable-input').fill(imagesSampleSkus.join(', '));
  await page.getByRole('switch', { name: 'Exact Match' }).click();
  await page.getByRole('button', { name: 'search-button' }).click();

  await page.locator('select').selectOption('50');

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - table:
      - rowgroup:
        - row "Key SKU Product Name Type Product Type Key Product Type Name Product Categories Product Selections Image 1 Image 1 link Image 2 Image 2 link Image 3 Image 3 link Image 4 Image 4 link Image 5 Image 5 link":
          - columnheader "Key"
          - columnheader "SKU"
          - columnheader "Product Name"
          - columnheader "Type"
          - columnheader "Product Type Key"
          - columnheader "Product Type Name"
          - columnheader "Product Categories"
          - columnheader "Product Selections"
          - columnheader "Image 1"
          - columnheader "Image 1 link"
          - columnheader "Image 2"
          - columnheader "Image 2 link"
          - columnheader "Image 3"
          - columnheader "Image 3 link"
          - columnheader "Image 4"
          - columnheader "Image 4 link"
          - columnheader "Image 5"
          - columnheader "Image 5 link"
      - rowgroup:
        - row /\\d+ 172547006C0050 5G2,5 NOIKLX \\d+ LGREY NOIKLX \\d+ NOIKLX \\d+ Building wires Global,Denmark NKT_LV_NOIKLX_5G2,5_RE_lgrey_C\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/igrixgk75a\\/png\\/NKT_LV_NOIKLX_5G2%2C5_RE_lgrey_C\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/:
          - cell /\\d+/
          - cell "172547006C0050"
          - cell /5G2,5 NOIKLX \\d+ LGREY/
          - cell "NOIKLX"
          - cell /\\d+/
          - cell /NOIKLX \\d+/
          - cell "Building wires"
          - cell "Global,Denmark"
          - cell "NKT_LV_NOIKLX_5G2,5_RE_lgrey_C.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/igrixgk75a\\/png\\/NKT_LV_NOIKLX_5G2%2C5_RE_lgrey_C\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /C115648 C115648 XZ1 \\(S\\) \\d+,\\d+\\/\\d+,\\d+ kV-DC 1x95 Al XZ1 \\(S\\) 250_XZ1_S XZ1 \\(S\\) Photovoltaic Spain,Portugal/:
          - cell "C115648"
          - cell "C115648"
          - cell /XZ1 \\(S\\) \\d+,\\d+\\/\\d+,\\d+ kV-DC 1x95 Al/
          - cell "XZ1 (S)"
          - cell "250_XZ1_S"
          - cell "XZ1 (S)"
          - cell "Photovoltaic"
          - cell "Spain,Portugal"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ \\(YAKXSżo\\) NA2XY-J 4x240 SE \\(YAKXSżo\\) NA2XY \\d+ \\(YAKXS\\) NA2XY 1 kV cables Global,Poland/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "(YAKXSżo) NA2XY-J 4x240 SE"
          - cell "(YAKXSżo) NA2XY"
          - cell /\\d+/
          - cell "(YAKXS) NA2XY"
          - cell "1 kV cables"
          - cell "Global,Poland"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ NA2XS\\(FL\\)2Y 1x400 RM\\/\\d+ 6\\/10kV NA2XS\\(FL\\)2Y \\d+ NA2XS\\(FL\\)2Y 6\\/\\d+ kV Medium-voltage cables Global,Czech_Republic/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /NA2XS\\(FL\\)2Y 1x400 RM\\/\\d+ 6\\/10kV/
          - cell "NA2XS(FL)2Y"
          - cell /\\d+/
          - cell /NA2XS\\(FL\\)2Y 6\\/\\d+ kV/
          - cell "Medium-voltage cables"
          - cell "Global,Czech_Republic"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ AXAQ-LT 6\\/\\d+\\(\\d+\\) kV 3x95\\/35AL AXAQ \\d+ AXAQ \\d+ kV Medium-voltage cables Sweden,Global,\\d+,\\d+,Denmark NKT_MV_AXAQ_3x95_W RMV_black_horz\\.jpg https:\\/\\/nkt\\.widen\\.net\\/content\\/aeo7yeg0cq\\/png\\/NKT_MV_AXAQ_3x95_W%20RMV_black_horz\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /AXAQ-LT 6\\/\\d+\\(\\d+\\) kV 3x95\\/35AL/
          - cell "AXAQ"
          - cell /\\d+/
          - cell /AXAQ \\d+ kV/
          - cell "Medium-voltage cables"
          - cell /Sweden,Global,\\d+,\\d+,Denmark/
          - cell "NKT_MV_AXAQ_3x95_W RMV_black_horz.jpg"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/aeo7yeg0cq\\/png\\/NKT_MV_AXAQ_3x95_W%20RMV_black_horz\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 165702004C0060 RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell "165702004C0060"
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 165702004C0100 RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell "165702004C0100"
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 165702004S0300 RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell "165702004S0300"
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 165702004D0500 RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell "165702004D0500"
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 165702004S0500 RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell "165702004S0500"
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 165702004D1000 RQRQ 2x10mm² \\(8AWG\\) CU Dca RQRQ \\d+ RQRQ \\(RLAFH\\), SL2\\.\\. Cu-screen Telecom energy cables Sweden,Global,\\d+/:
          - cell /\\d+/
          - cell "165702004D1000"
          - cell "RQRQ 2x10mm² (8AWG) CU Dca"
          - cell "RQRQ"
          - cell /\\d+/
          - cell "RQRQ (RLAFH), SL2.. Cu-screen"
          - cell "Telecom energy cables"
          - cell /Sweden,Global,\\d+/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /C119296 C119296 RHZ1-RA\\+2OL \\d+\\/\\d+ KV 1x1200 MAl \\+ T375 RHZ1 205_RHZ1 RHZ1 High-voltage cables Spain/:
          - cell "C119296"
          - cell "C119296"
          - cell /RHZ1-RA\\+2OL \\d+\\/\\d+ KV 1x1200 MAl \\+ T375/
          - cell "RHZ1"
          - cell "205_RHZ1"
          - cell "RHZ1"
          - cell "High-voltage cables"
          - cell "Spain"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /C116060 C116060 RHZ1-OL \\d+\\/\\d+ kV 1x500 KAl \\+ H16 \\(AT\\+AR\\) RHZ1 230_RHZ1 RHZ1 Medium-voltage cables Spain/:
          - cell "C116060"
          - cell "C116060"
          - cell /RHZ1-OL \\d+\\/\\d+ kV 1x500 KAl \\+ H16 \\(AT\\+AR\\)/
          - cell "RHZ1"
          - cell "230_RHZ1"
          - cell "RHZ1"
          - cell "Medium-voltage cables"
          - cell "Spain"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 172547022D1000 1G35 NOIKLX \\d+ LGREY NOIKLX \\d+ NOIKLX \\d+ Building wires Global,Denmark NKT_LV_NOIKLX_1G35_RM_lgrey_D\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/hopvgdgiva\\/png\\/NKT_LV_NOIKLX_1G35_RM_lgrey_D\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y NKT_LV_NOIKLX_1G35_RM_lgrey_angle\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/uqvhcz92c9\\/png\\/NKT_LV_NOIKLX_1G35_RM_lgrey_angle\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/:
          - cell /\\d+/
          - cell "172547022D1000"
          - cell /1G35 NOIKLX \\d+ LGREY/
          - cell "NOIKLX"
          - cell /\\d+/
          - cell /NOIKLX \\d+/
          - cell "Building wires"
          - cell "Global,Denmark"
          - cell "NKT_LV_NOIKLX_1G35_RM_lgrey_D.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/hopvgdgiva\\/png\\/NKT_LV_NOIKLX_1G35_RM_lgrey_D\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKLX_1G35_RM_lgrey_angle.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/uqvhcz92c9\\/png\\/NKT_LV_NOIKLX_1G35_RM_lgrey_angle\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ U-\\d+ AR2V 4X95 RMV U-\\d+ AR2V \\d+ U-\\d+ AR2V 1 kV cables Global/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /U-\\d+ AR2V 4X95 RMV/
          - cell /U-\\d+ AR2V/
          - cell /\\d+/
          - cell /U-\\d+ AR2V/
          - cell "1 kV cables"
          - cell "Global"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ PFSP-AL 3x240AFV\\/\\d+ \\d+,\\d+\\/1kV PFSP \\d+ PFSP Al 1 kV cables Global/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /PFSP-AL 3x240AFV\\/\\d+ \\d+,\\d+\\/1kV/
          - cell "PFSP"
          - cell /\\d+/
          - cell "PFSP Al"
          - cell "1 kV cables"
          - cell "Global"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ 110707010D0400 PFSP-AL 3x240AFV\\/\\d+ \\d+,\\d+\\/1kV PFSP \\d+ PFSP Al 1 kV cables Global/:
          - cell /\\d+/
          - cell "110707010D0400"
          - cell /PFSP-AL 3x240AFV\\/\\d+ \\d+,\\d+\\/1kV/
          - cell "PFSP"
          - cell /\\d+/
          - cell "PFSP Al"
          - cell "1 kV cables"
          - cell "Global"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ 4X50 NOIKX FLEX \\d+ 1 KV\\. LGREY NOIKX Flex \\d+ NOIKX Flex \\d+ 1 kV cables Global,Denmark NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_horz\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/ix5mvz3ciy\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_horz\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/x9vucitprw\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle_cs\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/h5dnffuung\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle_cs\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y NKT_LV_NOIKX_Flex_90_4x120_lgrey_cs\\.png https:\\/\\/nkt\\.widen\\.net\\/content\\/kmkdeg9arn\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_lgrey_cs\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /4X50 NOIKX FLEX \\d+ 1 KV\\. LGREY/
          - cell "NOIKX Flex"
          - cell /\\d+/
          - cell /NOIKX Flex \\d+/
          - cell "1 kV cables"
          - cell "Global,Denmark"
          - cell "NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_horz.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/ix5mvz3ciy\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_horz\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/x9vucitprw\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle_cs.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/h5dnffuung\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_RF5_lgrey_angle_cs\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKX_Flex_90_4x120_lgrey_cs.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/kmkdeg9arn\\/png\\/NKT_LV_NOIKX_Flex_90_4x120_lgrey_cs\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell
          - cell
        - row /\\d+ 160063018S0500 H05VV-F 4G1,5 white H05VV-F \\d+ H05VV-F white RAL \\d+ Flexible cables Global,Czech_Republic,France,Poland/:
          - cell /\\d+/
          - cell "160063018S0500"
          - cell "H05VV-F 4G1,5 white"
          - cell "H05VV-F"
          - cell /\\d+/
          - cell /H05VV-F white RAL \\d+/
          - cell "Flexible cables"
          - cell "Global,Czech_Republic,France,Poland"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ NOPOVIC 1-CXKH-V-J 5x35 RMV 1-CXKH-V \\d+ NOPOVIC 1-CXKH-V E60 Fire performance cables Global,Czech_Republic/:
          - cell /\\d+/
          - cell /\\d+/
          - cell "NOPOVIC 1-CXKH-V-J 5x35 RMV"
          - cell "1-CXKH-V"
          - cell /\\d+/
          - cell "NOPOVIC 1-CXKH-V E60"
          - cell "Fire performance cables"
          - cell "Global,Czech_Republic"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ NYCWY 3x10 RE\\/\\d+ NYCWY \\d+ NYCWY 1 kV cables Global,Czech_Republic/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /NYCWY 3x10 RE\\/\\d+/
          - cell "NYCWY"
          - cell /\\d+/
          - cell "NYCWY"
          - cell "1 kV cables"
          - cell "Global,Czech_Republic"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row:
          - cell /\\d+/
          - cell "172572025D0500"
          - cell /4X6 NOIKLX \\d+ Dca LGREY/
          - cell "NOIKLX Dca"
          - cell /\\d+/
          - cell /NOIKLX® \\d+/
          - cell "Building wires"
          - cell "Global,Denmark"
          - cell "NKT_LV_NOIKLX Dca_4x6_RM_lgrey_D.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/o8ngusdudb\\/png\\/NKT_LV_NOIKLX%20Dca_4x6_RM_lgrey_D\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKLX Dca_4x6_RM_lgrey_angle.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/op0wasy8ug\\/png\\/NKT_LV_NOIKLX%20Dca_4x6_RM_lgrey_angle\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKLX Dca_4x6_RM_lgrey_horz.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/ft4dk6rv0b\\/png\\/NKT_LV_NOIKLX%20Dca_4x6_RM_lgrey_horz\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKLX Dca_4X6_RM_lgrey_angle_cs.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/yrdueofak8\\/png\\/NKT_LV_NOIKLX%20Dca_4X6_RM_lgrey_angle_cs\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
          - cell "NKT_LV_NOIKLX Dca_4X6_RM_lgrey_cs.png"
          - cell /https:\\/\\/nkt\\.widen\\.net\\/content\\/3ubwo54gzl\\/png\\/NKT_LV_NOIKLX%20Dca_4X6_RM_lgrey_cs\\.png\\?position=c&color=ffffffff&quality=\\d+&u=egze6y/
        - row /C120133 C120133 RHZ1-OL \\(S\\) 6\\/\\d+ kV 1x400 KAl \\+ H16 RHZ1 230_RHZ1 RHZ1 Medium-voltage cables Spain/:
          - cell "C120133"
          - cell "C120133"
          - cell /RHZ1-OL \\(S\\) 6\\/\\d+ kV 1x400 KAl \\+ H16/
          - cell "RHZ1"
          - cell "230_RHZ1"
          - cell "RHZ1"
          - cell "Medium-voltage cables"
          - cell "Spain"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /C96028 C96028 Pétunia \\d+ \\(\\d+-AL4\\/\\d+-ST6C\\) C5 AACSR 206_AACSR AACSR Steel reinforced AACSR conductors France/:
          - cell "C96028"
          - cell "C96028"
          - cell /Pétunia \\d+ \\(\\d+-AL4\\/\\d+-ST6C\\) C5/
          - cell "AACSR"
          - cell "206_AACSR"
          - cell "AACSR"
          - cell "Steel reinforced AACSR conductors"
          - cell "France"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ S1Z1-K [\\d,.]+[bkmBKM]+² \\(4AWG\\) Grey Cca S1Z1-K \\d+ S1Z1-K Telecom energy cables Sweden,Global/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /S1Z1-K [\\d,.]+[bkmBKM]+² \\(4AWG\\) Grey Cca/
          - cell "S1Z1-K"
          - cell /\\d+/
          - cell "S1Z1-K"
          - cell "Telecom energy cables"
          - cell "Sweden,Global"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ N2XS\\(F\\)2Y 1x300 RM\\/\\d+ \\d+\\/30kV N2XS\\(F\\)2Y \\d+ N2XS\\(F\\)2Y \\d+\\/\\d+ kV Medium-voltage cables Global,Czech_Republic/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /N2XS\\(F\\)2Y 1x300 RM\\/\\d+ \\d+\\/30kV/
          - cell "N2XS(F)2Y"
          - cell /\\d+/
          - cell /N2XS\\(F\\)2Y \\d+\\/\\d+ kV/
          - cell "Medium-voltage cables"
          - cell "Global,Czech_Republic"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
        - row /\\d+ \\d+ AXALJ-TT \\d+\\/\\d+\\(\\d+\\) kV 1x300\\/35EQV AXALJ-TT \\d+ AXALJ \\d+ kV Medium-voltage cables Sweden,Global,Denmark/:
          - cell /\\d+/
          - cell /\\d+/
          - cell /AXALJ-TT \\d+\\/\\d+\\(\\d+\\) kV 1x300\\/35EQV/
          - cell "AXALJ-TT"
          - cell /\\d+/
          - cell /AXALJ \\d+ kV/
          - cell "Medium-voltage cables"
          - cell "Sweden,Global,Denmark"
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
          - cell
    `);
});
