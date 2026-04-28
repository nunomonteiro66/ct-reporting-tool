export const mockColumns = [
  {
    key: 'key',
    label: 'key',
    isSortable: true,
  },
  {
    key: 'sku',
    label: 'SKU',
    isSortable: true,
  },
  {
    key: 'productType.key',
    label: 'Product Type Key',
    isSortable: true,
  },
  {
    key: 'productType.name',
    label: 'Product Type Name',
    isSortable: true,
  },
  {
    key: 'categories',
    label: 'Categories',
    isSortable: true,
  },
  {
    key: 'selections',
    label: 'Product Selections',
    isSortable: true,
  },
  {
    key: 'image',
    label: 'Image',
    isSortable: true,
  },
  {
    key: 'epd',
    label: 'EPD',
    isSortable: true,
  },
  {
    key: 'dop',
    label: 'DOP',
    isSortable: true,
  },
  {
    key: 'doc',
    label: 'DOC',
    isSortable: true,
  },
  {
    key: 'datasheet',
    label: 'Datasheet',
    isSortable: true,
  },
  {
    label: '0000_drum_type',
    key: 'attributes.0000_drum_type',
    isVisible: false,
    children: [
      {
        label: 'Packaging (en)',
        key: 'en',
      },
      {
        label: 'Forpakning (da)',
        key: 'da',
      },
      {
        label: 'Förpackning (sv)',
        key: 'sv',
      },
      {
        label: 'Packaging (cs)',
        key: 'cs',
      },
      {
        label: 'Opakowanie (pl)',
        key: 'pl',
      },
      {
        label: 'Packaging (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Conditionnement (fr)',
        key: 'fr',
      },
      {
        label: 'Packaging (pt)',
        key: 'pt',
      },
      {
        label: 'Packaging (de)',
        key: 'de',
      },
      {
        label: 'Packaging (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'EAN (0000_barcode_ean_code)',
    key: 'attributes.0000_barcode_ean_code',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'EL (0000_branch_code)',
    key: 'attributes.0000_branch_code',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Number of cores (91_number_of_cores)',
    key: 'attributes.91_number_of_cores',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '719_certificate',
    key: 'attributes.719_certificate',
    isVisible: false,
    children: [
      {
        label: 'Certificate (en)',
        key: 'en',
      },
      {
        label: 'Certifikat (da)',
        key: 'da',
      },
      {
        label: 'Certifikat (sv)',
        key: 'sv',
      },
      {
        label: 'Certificate (cs)',
        key: 'cs',
      },
      {
        label: 'Certyfikat (pl)',
        key: 'pl',
      },
      {
        label: 'Certificate (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Certificat (fr)',
        key: 'fr',
      },
      {
        label: 'Certificate (pt)',
        key: 'pt',
      },
      {
        label: 'Certificate (de)',
        key: 'de',
      },
      {
        label: 'Certificate (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '1607_cpr_classification',
    key: 'attributes.1607_cpr_classification',
    isVisible: false,
    children: [
      {
        label: 'CPR-Classification (en)',
        key: 'en',
      },
      {
        label: 'CPR-klassifikation (da)',
        key: 'da',
      },
      {
        label: 'CPR-klass (sv)',
        key: 'sv',
      },
      {
        label: 'CPR-Classification (cs)',
        key: 'cs',
      },
      {
        label: 'Reakcja na ogień (CPR) (pl)',
        key: 'pl',
      },
      {
        label: 'CPR-Classification (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Classification CPR (fr)',
        key: 'fr',
      },
      {
        label: 'Classificação-CPR (pt)',
        key: 'pt',
      },
      {
        label: 'CPR-Classification (de)',
        key: 'de',
      },
      {
        label: 'CPR-Classification (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '14_material_of_conductor',
    key: 'attributes.14_material_of_conductor',
    isVisible: false,
    children: [
      {
        label: 'Material of conductor (en)',
        key: 'en',
      },
      {
        label: 'Ledermateriale (da)',
        key: 'da',
      },
      {
        label: 'Material ledare (sv)',
        key: 'sv',
      },
      {
        label: 'Material of conductor (cs)',
        key: 'cs',
      },
      {
        label: 'Materiał żyły (pl)',
        key: 'pl',
      },
      {
        label: 'Material of conductor (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Matériau de l'âme (fr)",
        key: 'fr',
      },
      {
        label: 'Material do condutor (pt)',
        key: 'pt',
      },
      {
        label: 'Material of conductor (de)',
        key: 'de',
      },
      {
        label: 'Material of conductor (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '842_colour_of_sheath',
    key: 'attributes.842_colour_of_sheath',
    isVisible: false,
    children: [
      {
        label: 'Colour of sheath (en)',
        key: 'en',
      },
      {
        label: 'Kappefarve (da)',
        key: 'da',
      },
      {
        label: 'Färg yttre mantel (sv)',
        key: 'sv',
      },
      {
        label: 'Colour of sheath (cs)',
        key: 'cs',
      },
      {
        label: 'Kolor powłoki zewnętrznej (pl)',
        key: 'pl',
      },
      {
        label: 'Colour of sheath (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Couleur de la gaine (fr)',
        key: 'fr',
      },
      {
        label: 'Cor da bainha (pt)',
        key: 'pt',
      },
      {
        label: 'Colour of sheath (de)',
        key: 'de',
      },
      {
        label: 'Colour of sheath (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Type (7_type)',
    key: 'attributes.7_type',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Diameter [mm] (9_diameter)',
    key: 'attributes.9_diameter',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Voltage U [kV] (15_voltage_u)',
    key: 'attributes.15_voltage_u',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Shape of conductor (18_shape_of_conductor)',
    key: 'attributes.18_shape_of_conductor',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Cross-section of screen [mm²] (22_cross_section_of_screen)',
    key: 'attributes.22_cross_section_of_screen',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '23_specification',
    key: 'attributes.23_specification',
    isVisible: false,
    children: [
      {
        label: 'Specification (en)',
        key: 'en',
      },
      {
        label: 'Specifikation (da)',
        key: 'da',
      },
      {
        label: 'Specifikation (sv)',
        key: 'sv',
      },
      {
        label: 'Specification (cs)',
        key: 'cs',
      },
      {
        label: 'Specyfikacja (pl)',
        key: 'pl',
      },
      {
        label: 'Specification (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Caractéristiques (fr)',
        key: 'fr',
      },
      {
        label: 'Specification (pt)',
        key: 'pt',
      },
      {
        label: 'Specification (de)',
        key: 'de',
      },
      {
        label: 'Specification (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Weight [kg] (28_weight)',
    key: 'attributes.28_weight',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Cross-section [mm²] (92_cross_section)',
    key: 'attributes.92_cross_section',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Norm (standard) (96_norm_standard)',
    key: 'attributes.96_norm_standard',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Number of group of product (544_number_of_group_of_product)',
    key: 'attributes.544_number_of_group_of_product',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Rated voltage U₀/U [kV] (835_rated_voltage_uo_u)',
    key: 'attributes.835_rated_voltage_uo_u',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Operating cond. temperature max. [°C] (853_operating_cond_temperature_max)',
    key: 'attributes.853_operating_cond_temperature_max',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Material insulation (1000_material_insulation)',
    key: 'attributes.1000_material_insulation',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '1001_material_sheath',
    key: 'attributes.1001_material_sheath',
    isVisible: false,
    children: [
      {
        label: 'Material sheath (en)',
        key: 'en',
      },
      {
        label: 'Kappemateriale (da)',
        key: 'da',
      },
      {
        label: 'Mantelmaterial (sv)',
        key: 'sv',
      },
      {
        label: 'Material sheath (cs)',
        key: 'cs',
      },
      {
        label: 'Powłoka zewnętrzna rodzaj tworzywa (pl)',
        key: 'pl',
      },
      {
        label: 'Material sheath (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Matériau de la gaine (fr)',
        key: 'fr',
      },
      {
        label: 'Material da bainha (pt)',
        key: 'pt',
      },
      {
        label: 'Material sheath (de)',
        key: 'de',
      },
      {
        label: 'Material sheath (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Voltage U₀ [kV] (1296_voltage_uo)',
    key: 'attributes.1296_voltage_uo',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '1427_type_of_screen',
    key: 'attributes.1427_type_of_screen',
    isVisible: false,
    children: [
      {
        label: 'Type of screen (en)',
        key: 'en',
      },
      {
        label: 'Skærmtype (da)',
        key: 'da',
      },
      {
        label: 'Skärmtyp (sv)',
        key: 'sv',
      },
      {
        label: 'Type of screen (cs)',
        key: 'cs',
      },
      {
        label: 'Rodzaj ekranu (pl)',
        key: 'pl',
      },
      {
        label: 'Type of screen (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Type d'écran (fr)",
        key: 'fr',
      },
      {
        label: 'Tipo de ecrã (pt)',
        key: 'pt',
      },
      {
        label: 'Type of screen (de)',
        key: 'de',
      },
      {
        label: 'Type of screen (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '1428_material_of_screen',
    key: 'attributes.1428_material_of_screen',
    isVisible: false,
    children: [
      {
        label: 'Material of screen (en)',
        key: 'en',
      },
      {
        label: 'Skærmmateriale (da)',
        key: 'da',
      },
      {
        label: 'Skärmmaterial (sv)',
        key: 'sv',
      },
      {
        label: 'Material of screen (cs)',
        key: 'cs',
      },
      {
        label: 'Materiał ekranu (pl)',
        key: 'pl',
      },
      {
        label: 'Material of screen (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Matériau de l'écran (fr)",
        key: 'fr',
      },
      {
        label: 'Material do ecrã (pt)',
        key: 'pt',
      },
      {
        label: 'Material of screen (de)',
        key: 'de',
      },
      {
        label: 'Material of screen (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Declaration of Conformity UE (CE) (2992_label_logotype_1)',
    key: 'attributes.2992_label_logotype_1',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Length [m] (0000_length)',
    key: 'attributes.0000_length',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Plants (0000_plants)',
    key: 'attributes.0000_plants',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Plants status (0000_plants_status)',
    key: 'attributes.0000_plants_status',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Sales orgs (0000_sales_orgs)',
    key: 'attributes.0000_sales_orgs',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Sales org status (0000_sales_org_status)',
    key: 'attributes.0000_sales_org_status',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Replacement (0000_replacement)',
    key: 'attributes.0000_replacement',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Country specific (0000_country_specific)',
    key: 'attributes.0000_country_specific',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Customer specific (0000_customer_specific)',
    key: 'attributes.0000_customer_specific',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '0000_application',
    key: 'attributes.0000_application',
    isVisible: false,
    children: [
      {
        label: 'Application (en)',
        key: 'en',
      },
      {
        label: 'Anvendelse (da)',
        key: 'da',
      },
      {
        label: 'Användning (sv)',
        key: 'sv',
      },
      {
        label: 'Application (cs)',
        key: 'cs',
      },
      {
        label: 'Zastosowanie (pl)',
        key: 'pl',
      },
      {
        label: 'Application (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Application (fr)',
        key: 'fr',
      },
      {
        label: 'Aplicação (pt)',
        key: 'pt',
      },
      {
        label: 'Application (de)',
        key: 'de',
      },
      {
        label: 'Application (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '0000_application_2',
    key: 'attributes.0000_application_2',
    isVisible: false,
    children: [
      {
        label: 'Application (en)',
        key: 'en',
      },
      {
        label: 'Anvendelse (da)',
        key: 'da',
      },
      {
        label: 'Användning (sv)',
        key: 'sv',
      },
      {
        label: 'Application (cs)',
        key: 'cs',
      },
      {
        label: 'Zastosowanie (pl)',
        key: 'pl',
      },
      {
        label: 'Application (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Application (fr)',
        key: 'fr',
      },
      {
        label: 'Application (pt)',
        key: 'pt',
      },
      {
        label: 'Application (de)',
        key: 'de',
      },
      {
        label: 'Application (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '1867_sap_characteristic_znkt_millca_standard_length',
    key: 'attributes.1867_sap_characteristic_znkt_millca_standard_length',
    isVisible: false,
    children: [
      {
        label: 'Length type (en)',
        key: 'en',
      },
      {
        label: 'Længdetype (da)',
        key: 'da',
      },
      {
        label: 'Längdtyp (sv)',
        key: 'sv',
      },
      {
        label: 'Length type (cs)',
        key: 'cs',
      },
      {
        label: 'Rodzaje odcinków (pl)',
        key: 'pl',
      },
      {
        label: 'Length type (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Longueur standardisée (fr)',
        key: 'fr',
      },
      {
        label: 'Length type (pt)',
        key: 'pt',
      },
      {
        label: 'Length type (de)',
        key: 'de',
      },
      {
        label: 'Length type (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '0000_sales_unit',
    key: 'attributes.0000_sales_unit',
    isVisible: false,
    children: [
      {
        label: 'Sales unit (en)',
        key: 'en',
      },
      {
        label: 'Sales unit (da)',
        key: 'da',
      },
      {
        label: 'Sales unit (sv)',
        key: 'sv',
      },
      {
        label: 'Sales unit (cs)',
        key: 'cs',
      },
      {
        label: 'Sales unit (pl)',
        key: 'pl',
      },
      {
        label: 'Sales unit (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Sales unit (fr)',
        key: 'fr',
      },
      {
        label: 'Sales unit (pt)',
        key: 'pt',
      },
      {
        label: 'Sales unit (de)',
        key: 'de',
      },
      {
        label: 'Sales unit (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '0000_base_uom',
    key: 'attributes.0000_base_uom',
    isVisible: false,
    children: [
      {
        label: 'Base UoM (en)',
        key: 'en',
      },
      {
        label: 'Base UoM (da)',
        key: 'da',
      },
      {
        label: 'Base UoM (sv)',
        key: 'sv',
      },
      {
        label: 'Base UoM (cs)',
        key: 'cs',
      },
      {
        label: 'Base UoM (pl)',
        key: 'pl',
      },
      {
        label: 'Base UoM (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Base UoM (fr)',
        key: 'fr',
      },
      {
        label: 'Base UoM (pt)',
        key: 'pt',
      },
      {
        label: 'Base UoM (de)',
        key: 'de',
      },
      {
        label: 'Base UoM (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Maximal voltage [kV] (1251_maximal_voltage)',
    key: 'attributes.1251_maximal_voltage',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Fire test (1013_fire_test)',
    key: 'attributes.1013_fire_test',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '721_reach',
    key: 'attributes.721_reach',
    isVisible: false,
    children: [
      {
        label: 'REACH (en)',
        key: 'en',
      },
      {
        label: 'REACH (da)',
        key: 'da',
      },
      {
        label: 'REACH (sv)',
        key: 'sv',
      },
      {
        label: 'REACH (cs)',
        key: 'cs',
      },
      {
        label: 'REACH (pl)',
        key: 'pl',
      },
      {
        label: 'REACH (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'REACH (fr)',
        key: 'fr',
      },
      {
        label: 'REACH (pt)',
        key: 'pt',
      },
      {
        label: 'REACH (de)',
        key: 'de',
      },
      {
        label: 'REACH (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Current carrying capacity in ground - trefoil [A] (732_current_carrying_capacity_in_ground_trefoil)',
    key: 'attributes.732_current_carrying_capacity_in_ground_trefoil',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Current carrying capacity in ground - flat [A] (733_current_carrying_capacity_in_ground_flat)',
    key: 'attributes.733_current_carrying_capacity_in_ground_flat',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Thickness - nominal insulation [mm] (61_thickness_nominal_insulation)',
    key: 'attributes.61_thickness_nominal_insulation',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Max. effective resistance conductor at 20°C [Ω/km] (63_max_effective_resistance_conductor_at_20_c)',
    key: 'attributes.63_max_effective_resistance_conductor_at_20_c',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Diameter of conductor [mm] (87_diameter_of_conductor)',
    key: 'attributes.87_diameter_of_conductor',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Weight informative [kg/km] (483_weight_informative)',
    key: 'attributes.483_weight_informative',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Test voltage [kV] (627_test_voltage)',
    key: 'attributes.627_test_voltage',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Maximal short-circuit temperature [°C] (628_maximal_short_circuit_temperature)',
    key: 'attributes.628_maximal_short_circuit_temperature',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '629_temperature_range',
    key: 'attributes.629_temperature_range',
    isVisible: false,
    children: [
      {
        label: 'Temperature range (en)',
        key: 'en',
      },
      {
        label: 'Drifttemperatur (da)',
        key: 'da',
      },
      {
        label: 'Temperaturområde för drift (sv)',
        key: 'sv',
      },
      {
        label: 'Temperature range (cs)',
        key: 'cs',
      },
      {
        label: 'Temperatura pracy - zakres (pl)',
        key: 'pl',
      },
      {
        label: 'Temperature range (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Plage de température (fr)',
        key: 'fr',
      },
      {
        label: 'Temperature range (pt)',
        key: 'pt',
      },
      {
        label: 'Temperature range (de)',
        key: 'de',
      },
      {
        label: 'Temperature range (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Minimal temperature for laying and manipulation [°C] (630_minimal_temperature_for_laying_and_manipulation)',
    key: 'attributes.630_minimal_temperature_for_laying_and_manipulation',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Minimal storage temperature [°C] (631_minimal_storage_temperature)',
    key: 'attributes.631_minimal_storage_temperature',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '632_colour_of_insulation',
    key: 'attributes.632_colour_of_insulation',
    isVisible: false,
    children: [
      {
        label: 'Colour of insulation (en)',
        key: 'en',
      },
      {
        label: 'Farve på isolering (da)',
        key: 'da',
      },
      {
        label: 'Färg isolering (sv)',
        key: 'sv',
      },
      {
        label: 'Colour of insulation (cs)',
        key: 'cs',
      },
      {
        label: 'Kolor izolacji (pl)',
        key: 'pl',
      },
      {
        label: 'Colour of insulation (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Couleur de l'isolant (fr)",
        key: 'fr',
      },
      {
        label: ' (pt)',
        key: 'pt',
      },
      {
        label: 'Colour of insulation (de)',
        key: 'de',
      },
      {
        label: 'Colour of insulation (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '635_self_extinguishing_of_one_cable',
    key: 'attributes.635_self_extinguishing_of_one_cable',
    isVisible: false,
    children: [
      {
        label: 'Self-extinguishing of one cable (en)',
        key: 'en',
      },
      {
        label: 'Brandhæmmende iht. (da)',
        key: 'da',
      },
      {
        label: 'Självslocknande, enkel kabel (sv)',
        key: 'sv',
      },
      {
        label: 'Self-extinguishing of one cable (cs)',
        key: 'cs',
      },
      {
        label: 'Rozprzestrzenianie płomienia pojedynczy kabel (pl)',
        key: 'pl',
      },
      {
        label: 'Self-extinguishing of one cable (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Capacité d'auto-extinction d'un câble (fr)",
        key: 'fr',
      },
      {
        label: 'Self-extinguishing of one cable (pt)',
        key: 'pt',
      },
      {
        label: 'Self-extinguishing of one cable (de)',
        key: 'de',
      },
      {
        label: 'Self-extinguishing of one cable (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Self-extinguishing of bunched cables (636_self_extinguishing_of_bunched_cables)',
    key: 'attributes.636_self_extinguishing_of_bunched_cables',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Maximal operating conductor temperature [°C] (643_maximal_operating_conductor_temperature)',
    key: 'attributes.643_maximal_operating_conductor_temperature',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Minimal radius of bend [mm] (647_minimal_radius_of_bend)',
    key: 'attributes.647_minimal_radius_of_bend',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Short circuit current (1s) [kA] (648_short_circuit_current_1s)',
    key: 'attributes.648_short_circuit_current_1s',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Capacitance [mikroF/km] (652_capacity)',
    key: 'attributes.652_capacity',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '656_uv_stability',
    key: 'attributes.656_uv_stability',
    isVisible: false,
    children: [
      {
        label: 'UV stability (en)',
        key: 'en',
      },
      {
        label: 'UV-bestandigt (da)',
        key: 'da',
      },
      {
        label: 'UV stabil (sv)',
        key: 'sv',
      },
      {
        label: 'UV stability (cs)',
        key: 'cs',
      },
      {
        label: 'Odporność na promieniowanie UV (pl)',
        key: 'pl',
      },
      {
        label: 'UV stability (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Stabilité aux UV (fr)',
        key: 'fr',
      },
      {
        label: 'UV stability (pt)',
        key: 'pt',
      },
      {
        label: 'UV stability (de)',
        key: 'de',
      },
      {
        label: 'UV stability (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Diameter informative [mm] (657_diameter_informative)',
    key: 'attributes.657_diameter_informative',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'No. of cores and cross-section [mm²] (661_no_of_cores_and_cross_section)',
    key: 'attributes.661_no_of_cores_and_cross_section',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Short circuit current of screening (1s) [kA] (669_short_circuit_current_of_screening)',
    key: 'attributes.669_short_circuit_current_of_screening',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Current carrying capacity in air - trefoil [A] (683_current_carrying_capacity_in_air_trefoil)',
    key: 'attributes.683_current_carrying_capacity_in_air_trefoil',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Current carrying capacity in air - flat [A] (684_current_carrying_capacity_in_air_flat)',
    key: 'attributes.684_current_carrying_capacity_in_air_flat',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '720_rohs',
    key: 'attributes.720_rohs',
    isVisible: false,
    children: [
      {
        label: 'RoHS (en)',
        key: 'en',
      },
      {
        label: 'RoHS (da)',
        key: 'da',
      },
      {
        label: 'RoHS (sv)',
        key: 'sv',
      },
      {
        label: 'RoHS (cs)',
        key: 'cs',
      },
      {
        label: 'RoHS (pl)',
        key: 'pl',
      },
      {
        label: 'RoHS (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'RoHS (fr)',
        key: 'fr',
      },
      {
        label: 'RoHS (pt)',
        key: 'pt',
      },
      {
        label: 'RoHS (de)',
        key: 'de',
      },
      {
        label: 'RoHS (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Nominal thickness of sheath [mm] (1019_nominal_thickness_of_sheath)',
    key: 'attributes.1019_nominal_thickness_of_sheath',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Inductance (in trefoil) [mH/km] (1245_cable_inductance_in_trefoil)',
    key: 'attributes.1245_cable_inductance_in_trefoil',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Inductance on air (side by side) [mH/km] (1247_cable_inductance_on_air_side_by_side)',
    key: 'attributes.1247_cable_inductance_on_air_side_by_side',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Inductance in ground (side by side) [mH/km] (1248_cable_inductance_in_ground_side_by_side)',
    key: 'attributes.1248_cable_inductance_in_ground_side_by_side',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '1252_declaration_of_conformity_ue_ce',
    key: 'attributes.1252_declaration_of_conformity_ue_ce',
    isVisible: false,
    children: [
      {
        label: 'Declaration of Conformity UE (CE) (en)',
        key: 'en',
      },
      {
        label: 'CE-overensstemmelse (da)',
        key: 'da',
      },
      {
        label: 'Uppfyller CE (sv)',
        key: 'sv',
      },
      {
        label: 'Declaration of Conformity UE (CE) (cs)',
        key: 'cs',
      },
      {
        label: 'Deklaracja zgodności UE (pl)',
        key: 'pl',
      },
      {
        label: 'Declaration of Conformity UE (CE) (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Déclaration de conformité UE (CE) (fr)',
        key: 'fr',
      },
      {
        label: 'Declaration of Conformity UE (CE) (pt)',
        key: 'pt',
      },
      {
        label: 'Declaration of Conformity UE (CE) (de)',
        key: 'de',
      },
      {
        label: 'Declaration of Conformity UE (CE) (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Thickness of inner semicond. manufacturing [mm] (1253_thickness_of_inner_semicond_manufacturing)',
    key: 'attributes.1253_thickness_of_inner_semicond_manufacturing',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Diameter over insulation inf. [mm] (1256_diameter_over_insulation_inf)',
    key: 'attributes.1256_diameter_over_insulation_inf',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Insulation resistance cable [GΩ/km] (1290_insulation_resistance_cable)',
    key: 'attributes.1290_insulation_resistance_cable',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Pulling force allowed [kN] (1295_pulling_force_allowed)',
    key: 'attributes.1295_pulling_force_allowed',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '1860_declaration_of_conformity',
    key: 'attributes.1860_declaration_of_conformity',
    isVisible: false,
    children: [
      {
        label: 'Declaration of conformity  (en)',
        key: 'en',
      },
      {
        label: 'Overensstemmelseserklæring (da)',
        key: 'da',
      },
      {
        label: 'Deklaration om överensstämmelse (sv)',
        key: 'sv',
      },
      {
        label: 'Declaration of conformity  (cs)',
        key: 'cs',
      },
      {
        label: 'Deklaracja zgodności (pl)',
        key: 'pl',
      },
      {
        label: 'Declaration of conformity  (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Déclaration de conformité (fr)',
        key: 'fr',
      },
      {
        label: 'Declaration of conformity  (pt)',
        key: 'pt',
      },
      {
        label: 'Declaration of conformity  (de)',
        key: 'de',
      },
      {
        label: 'Declaration of conformity  (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Max. resistance of screening at 20 °C [Ω/km] (1115_max_resistance_of_screening_at_20_c)',
    key: 'attributes.1115_max_resistance_of_screening_at_20_c',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Thickness - nominal sheath [mm] (62_thickness_nominal_sheath)',
    key: 'attributes.62_thickness_nominal_sheath',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Max. effective resistance screen at 20°C [Ω/km] (99_max_effective_resistance_screen_at_20_c)',
    key: 'attributes.99_max_effective_resistance_screen_at_20_c',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Diameter (height) of conductor [mm] (349_diameter_height_of_conductor)',
    key: 'attributes.349_diameter_height_of_conductor',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Smoke density (637_smoke_density)',
    key: 'attributes.637_smoke_density',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '638_circuit_integrity_in_case_of_a_fire_fe180',
    key: 'attributes.638_circuit_integrity_in_case_of_a_fire_fe180',
    isVisible: false,
    children: [
      {
        label: 'Circuit integrity in case of a fire (FE180) (en)',
        key: 'en',
      },
      {
        label: 'Kredsløbsintegritet ved brand (da)',
        key: 'da',
      },
      {
        label: 'Elektrisk funktionalitet  vid brand (sv)',
        key: 'sv',
      },
      {
        label: 'Circuit integrity in case of a fire (FE180) (cs)',
        key: 'cs',
      },
      {
        label: 'Podtrzymywanie funkcji kabla w warunkach pożaru (pl)',
        key: 'pl',
      },
      {
        label: 'Circuit integrity in case of a fire (FE180) (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Circuit integrity in case of a fire (FE180) (fr)',
        key: 'fr',
      },
      {
        label: 'Circuit integrity in case of a fire (FE180) (pt)',
        key: 'pt',
      },
      {
        label: 'Circuit integrity in case of a fire (FE180) (de)',
        key: 'de',
      },
      {
        label: 'Circuit integrity in case of a fire (FE180) (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '639_system_integrity_in_case_of_a_fire',
    key: 'attributes.639_system_integrity_in_case_of_a_fire',
    isVisible: false,
    children: [
      {
        label: 'System integrity in case of a fire (en)',
        key: 'en',
      },
      {
        label: 'Systemintegritet ved brand (da)',
        key: 'da',
      },
      {
        label: 'Systemintegritet vid brand (sv)',
        key: 'sv',
      },
      {
        label: 'System integrity in case of a fire (cs)',
        key: 'cs',
      },
      {
        label: 'Podtrzymanie funkcji systemu kablowego w pożarze (pl)',
        key: 'pl',
      },
      {
        label: 'System integrity in case of a fire (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'System integrity in case of a fire (fr)',
        key: 'fr',
      },
      {
        label: 'System integrity in case of a fire (pt)',
        key: 'pt',
      },
      {
        label: 'System integrity in case of a fire (de)',
        key: 'de',
      },
      {
        label: 'System integrity in case of a fire (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Corrosivity of emitted gases (640_corrosivity_of_emitted_gases)',
    key: 'attributes.640_corrosivity_of_emitted_gases',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '641_improved_safety_in_case_of_fire_cpr',
    key: 'attributes.641_improved_safety_in_case_of_fire_cpr',
    isVisible: false,
    children: [
      {
        label: 'Improved safety in case of fire CPR (en)',
        key: 'en',
      },
      {
        label: 'Forbedret sikkerhed ved brand CPR (da)',
        key: 'da',
      },
      {
        label: 'Förbättrad säkerhet vid brand (CPR) (sv)',
        key: 'sv',
      },
      {
        label: 'Improved safety in case of fire CPR (cs)',
        key: 'cs',
      },
      {
        label: 'Reakcja na oddziaływanie ognia  (pl)',
        key: 'pl',
      },
      {
        label: 'Improved safety in case of fire CPR (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Improved safety in case of fire CPR (fr)',
        key: 'fr',
      },
      {
        label: 'Improved safety in case of fire CPR (pt)',
        key: 'pt',
      },
      {
        label: 'Improved safety in case of fire CPR (de)',
        key: 'de',
      },
      {
        label: 'Improved safety in case of fire CPR (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Current carrying capacity single cable in air [A] (650_current_carrying_capacity_single_cable_in_air)',
    key: 'attributes.650_current_carrying_capacity_single_cable_in_air',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Current carrying capacity single cable in ground [A] (651_current_carrying_capacity_single_cable_in_ground)',
    key: 'attributes.651_current_carrying_capacity_single_cable_in_ground',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Inductance [mH/km] (653_inductivity)',
    key: 'attributes.653_inductivity',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Max. permitted pulling force [N] (718_max_permitted_pulling_force)',
    key: 'attributes.718_max_permitted_pulling_force',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Conductivity - pH change  (2263_conductivity_ph_change)',
    key: 'attributes.2263_conductivity_ph_change',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '49_colour_identification_of_cores',
    key: 'attributes.49_colour_identification_of_cores',
    isVisible: false,
    children: [
      {
        label: 'Colour identification of cores (en)',
        key: 'en',
      },
      {
        label: 'Lederidentifikation (da)',
        key: 'da',
      },
      {
        label: 'Partfärger (sv)',
        key: 'sv',
      },
      {
        label: 'Colour identification of cores (cs)',
        key: 'cs',
      },
      {
        label: 'Kolorystyka żył (barwna identyfikacja) (pl)',
        key: 'pl',
      },
      {
        label: 'Colour identification of cores (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Identification par couleur des conducteurs (fr)',
        key: 'fr',
      },
      {
        label: ' (pt)',
        key: 'pt',
      },
      {
        label: 'Colour identification of cores (de)',
        key: 'de',
      },
      {
        label: 'Colour identification of cores (es)',
        key: 'es',
      },
    ],
  },
  {
    label:
      'Zero sequence resistance (R0) [Ω/km] (662_zero_sequence_resistance_r0)',
    key: 'attributes.662_zero_sequence_resistance_r0',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Positive sequence resistance (R1) [Ω/km] (663_positive_sequence_resistance_r1)',
    key: 'attributes.663_positive_sequence_resistance_r1',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Zero sequence reactance (X0) [Ω/km] (664_zero_sequence_reactance_x0)',
    key: 'attributes.664_zero_sequence_reactance_x0',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Positive sequence reactance (X1) [Ω/km] (665_positive_sequence_reactance_x1)',
    key: 'attributes.665_positive_sequence_reactance_x1',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Height of cable [mm] (1338_height_of_cable)',
    key: 'attributes.1338_height_of_cable',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Width of cable [mm] (1341_width_of_cable)',
    key: 'attributes.1341_width_of_cable',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Cross-section AWG (1456_cross_section_awg)',
    key: 'attributes.1456_cross_section_awg',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Inductance - trefoil [mH/km] (685_inductivity_trefoil)',
    key: 'attributes.685_inductivity_trefoil',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Tensile strength [N] (550_tensile_strength)',
    key: 'attributes.550_tensile_strength',
    isVisible: false,
    isSortable: true,
  },
  {
    label:
      'Cross-section of reduced conductor [mm²] (88_cross_section_of_reduced_conductor)',
    key: 'attributes.88_cross_section_of_reduced_conductor',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Shape of reduced conductor (93_shape_of_reduced_conductor)',
    key: 'attributes.93_shape_of_reduced_conductor',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Voltage U(V) [V] (1346_voltage_u_v)',
    key: 'attributes.1346_voltage_u_v',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'esp_greased',
    key: 'attributes.esp_greased',
    isVisible: false,
    children: [
      {
        label: 'Greased (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Greased (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Greased (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Graissé (fr)',
        key: 'fr',
      },
      {
        label: 'Com massa lubrificante (pt)',
        key: 'pt',
      },
      {
        label: 'Greased (de)',
        key: 'de',
      },
      {
        label: 'Greased (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'esp_grease_application_type',
    key: 'attributes.esp_grease_application_type',
    isVisible: false,
    children: [
      {
        label: 'Grease application type (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Grease application type (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Grease application type (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Type de graisse d'application (fr)",
        key: 'fr',
      },
      {
        label: 'Tipo de aplicação da massa (pt)',
        key: 'pt',
      },
      {
        label: 'Grease application type (de)',
        key: 'de',
      },
      {
        label: 'Grease application type (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Number of wires of conductor (73_number_of_wires_of_conductor)',
    key: 'attributes.73_number_of_wires_of_conductor',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Al alloy type (esp_al_alloy_type)',
    key: 'attributes.esp_al_alloy_type',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'esp_core_material',
    key: 'attributes.esp_core_material',
    isVisible: false,
    children: [
      {
        label: 'Core material (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Core material (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Core material (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Matériau de l'âme centrale (fr)",
        key: 'fr',
      },
      {
        label: 'Material do núcleo (pt)',
        key: 'pt',
      },
      {
        label: 'Core material (de)',
        key: 'de',
      },
      {
        label: 'Core material (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'Steel type (esp_steel_type)',
    key: 'attributes.esp_steel_type',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Al type (esp_al_type)',
    key: 'attributes.esp_al_type',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'ACS type (esp_acs_type)',
    key: 'attributes.esp_acs_type',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Number of fibers (esp_number_of_fibers)',
    key: 'attributes.esp_number_of_fibers',
    isVisible: false,
    isSortable: true,
  },
  {
    label: 'Type of fiber (esp_type_of_fiber)',
    key: 'attributes.esp_type_of_fiber',
    isVisible: false,
    isSortable: true,
  },
  {
    label: '1430_longitudinal_water_blocking_conductor',
    key: 'attributes.1430_longitudinal_water_blocking_conductor',
    isVisible: false,
    children: [
      {
        label: 'Longitudinal water blocking conductor (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Longitudinal water blocking conductor (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Longitudinal water blocking conductor (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Etanchéité longitudinale de l'âme (fr)",
        key: 'fr',
      },
      {
        label: 'Condutor com bloqueio longitudinal à água (pt)',
        key: 'pt',
      },
      {
        label: 'Longitudinal water blocking conductor (de)',
        key: 'de',
      },
      {
        label: 'Longitudinal water blocking conductor (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '1429_type_of_semiconductive_layer_over_insulation',
    key: 'attributes.1429_type_of_semiconductive_layer_over_insulation',
    isVisible: false,
    children: [
      {
        label: 'Type of semiconductive layer over insulation (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Type of semiconductive layer over insulation (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Type of semiconductive layer over insulation (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Type of semiconductive layer over insulation (fr)',
        key: 'fr',
      },
      {
        label: 'Tipo de camada semicondutora sobre a isolação (pt)',
        key: 'pt',
      },
      {
        label: 'Type of semiconductive layer over insulation (de)',
        key: 'de',
      },
      {
        label: 'Type of semiconductive layer over insulation (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '1431_longitudinal_water_blocking_screen',
    key: 'attributes.1431_longitudinal_water_blocking_screen',
    isVisible: false,
    children: [
      {
        label: 'Longitudinal water blocking screen (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Longitudinal water blocking screen (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Longitudinal water blocking screen (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Etanchéité longitudinale de l'écran (fr)",
        key: 'fr',
      },
      {
        label: 'Ecrã com bloqueio longitudinal à água (pt)',
        key: 'pt',
      },
      {
        label: 'Longitudinal water blocking screen (de)',
        key: 'de',
      },
      {
        label: 'Longitudinal water blocking screen (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '1432_radial_water_blocking',
    key: 'attributes.1432_radial_water_blocking',
    isVisible: false,
    children: [
      {
        label: 'Radial water blocking (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Radial water blocking (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Radial water blocking (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Etanchéité radiale (fr)',
        key: 'fr',
      },
      {
        label: 'Bloqueio radial à água (pt)',
        key: 'pt',
      },
      {
        label: 'Radial water blocking (de)',
        key: 'de',
      },
      {
        label: 'Radial water blocking (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'esp_mechanical_protection',
    key: 'attributes.esp_mechanical_protection',
    isVisible: false,
    children: [
      {
        label: 'Mechanical protection (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Mechanical protection (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Mechanical protection (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Protection mécanique (fr)',
        key: 'fr',
      },
      {
        label: 'Proteção mecânica (pt)',
        key: 'pt',
      },
      {
        label: 'Mechanical protection (de)',
        key: 'de',
      },
      {
        label: 'Mechanical protection (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'esp_semiconductive_screen_over_sheath',
    key: 'attributes.esp_semiconductive_screen_over_sheath',
    isVisible: false,
    children: [
      {
        label: 'Semiconductive screen over sheath (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Semiconductive screen over sheath (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Semiconductive screen over sheath (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Écran semi-conducteur sur gaine (fr)',
        key: 'fr',
      },
      {
        label: 'Camada semicondutora sobre a bainha (pt)',
        key: 'pt',
      },
      {
        label: 'Semiconductive screen over sheath (de)',
        key: 'de',
      },
      {
        label: 'Semiconductive screen over sheath (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'esp_type_of_armour',
    key: 'attributes.esp_type_of_armour',
    isVisible: false,
    children: [
      {
        label: 'Type of armour (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Type of armour (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Type of armour (en-GB)',
        key: 'en-GB',
      },
      {
        label: "Type d'armure (fr)",
        key: 'fr',
      },
      {
        label: 'Tipo de armadura (pt)',
        key: 'pt',
      },
      {
        label: 'Type of armour (de)',
        key: 'de',
      },
      {
        label: 'Type of armour (es)',
        key: 'es',
      },
    ],
  },
  {
    label: 'esp_anti_rodent_termite_sheath_additive',
    key: 'attributes.esp_anti_rodent_termite_sheath_additive',
    isVisible: false,
    children: [
      {
        label: 'Anti-rodent/Termite sheath additive (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Anti-rodent/Termite sheath additive (cs)',
        key: 'cs',
      },
      {
        label: 'Anti-rodent/Termite sheath additive (pl)',
        key: 'pl',
      },
      {
        label: 'Anti-rodent/Termite sheath additive (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Anti-rodent/Termite sheath additive (fr)',
        key: 'fr',
      },
      {
        label: 'Aditivo de bainha anti-roedores/térmitas (pt)',
        key: 'pt',
      },
      {
        label: 'Anti-rodent/Termite sheath additive (de)',
        key: 'de',
      },
      {
        label: 'Anti-rodent/Termite sheath additive (es)',
        key: 'es',
      },
    ],
  },
  {
    label: '2450_electric_current_type',
    key: 'attributes.2450_electric_current_type',
    isVisible: false,
    children: [
      {
        label: 'Electric current type (en)',
        key: 'en',
      },
      {
        label: ' (da)',
        key: 'da',
      },
      {
        label: ' (sv)',
        key: 'sv',
      },
      {
        label: 'Electric current type (cs)',
        key: 'cs',
      },
      {
        label: ' (pl)',
        key: 'pl',
      },
      {
        label: 'Electric current type (en-GB)',
        key: 'en-GB',
      },
      {
        label: 'Electric current type (fr)',
        key: 'fr',
      },
      {
        label: 'Tipo de corrente elétrica (pt)',
        key: 'pt',
      },
      {
        label: 'Electric current type (de)',
        key: 'de',
      },
      {
        label: 'Electric current type (es)',
        key: 'es',
      },
    ],
  },
  {
    key: 'names',
    label: 'Product Name',
    children: [
      {
        key: 'en',
        label: 'Product Name (EN)',
      },
      {
        key: 'da',
        label: 'Product Name (DA)',
      },
      {
        key: 'sv',
        label: 'Product Name (SV)',
      },
      {
        key: 'cs',
        label: 'Product Name (CS)',
      },
      {
        key: 'pl',
        label: 'Product Name (PL)',
      },
      {
        key: 'en-GB',
        label: 'Product Name (EN-GB)',
      },
      {
        key: 'fr',
        label: 'Product Name (FR)',
      },
      {
        key: 'pt',
        label: 'Product Name (PT)',
      },
      {
        key: 'de',
        label: 'Product Name (DE)',
      },
      {
        key: 'es',
        label: 'Product Name (ES)',
      },
    ],
  },
  {
    key: 'descriptions',
    label: 'Descriptions',
    children: [
      {
        key: 'en',
        label: 'Descriptions (EN)',
      },
      {
        key: 'da',
        label: 'Descriptions (DA)',
      },
      {
        key: 'sv',
        label: 'Descriptions (SV)',
      },
      {
        key: 'cs',
        label: 'Descriptions (CS)',
      },
      {
        key: 'pl',
        label: 'Descriptions (PL)',
      },
      {
        key: 'en-GB',
        label: 'Descriptions (EN-GB)',
      },
      {
        key: 'fr',
        label: 'Descriptions (FR)',
      },
      {
        key: 'pt',
        label: 'Descriptions (PT)',
      },
      {
        key: 'de',
        label: 'Descriptions (DE)',
      },
      {
        key: 'es',
        label: 'Descriptions (ES)',
      },
    ],
  },
];
