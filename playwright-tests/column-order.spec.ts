import { test, expect, Page } from '@playwright/test';
import {
  checkTableHeaders,
  dragToReorder,
  openAllProductsScreen,
  openAttributesFilter,
} from './helpers';
import { COLUMN_ORDER } from '../src/screens/AllProducts/columns-order';

const columnOrdererComponentScreenshot = `
    - button "key Remove":
      - text: ""
      - button "Remove"
    - button "SKU Remove":
      - text: ""
      - button "Remove"
    - button "Product Name Remove":
      - text: ""
      - button "Remove"
    - button "Product Type Key Remove":
      - text: ""
      - button "Remove"
    - button "Product Type Name Remove":
      - text: ""
      - button "Remove"
    - button "Number of group of product (544_number_of_group_of_product) Remove":
      - text: ""
      - button "Remove"
    - button "Type (7_type) Remove":
      - text: ""
      - button "Remove"
    - button "23_specification Remove":
      - text: ""
      - button "Remove"
    - button "EAN (0000_barcode_ean_code) Remove":
      - text: ""
      - button "Remove"
    - button "EL (0000_branch_code) Remove":
      - text: ""
      - button "Remove"
    - button "Country specific (0000_country_specific) Remove":
      - text: ""
      - button "Remove"
    - button "Customer specific (0000_customer_specific) Remove":
      - text: ""
      - button "Remove"
    - button "Plants (0000_plants) Remove":
      - text: ""
      - button "Remove"
    - button "Plants status (0000_plants_status) Remove":
      - text: ""
      - button "Remove"
    - button "Sales orgs (0000_sales_orgs) Remove":
      - text: ""
      - button "Remove"
    - button "Sales org status (0000_sales_org_status) Remove":
      - text: ""
      - button "Remove"
    - button "Replacement (0000_replacement) Remove":
      - text: ""
      - button "Remove"
    - button "Image Remove":
      - text: ""
      - button "Remove"
    - button "Datasheet Remove":
      - text: ""
      - button "Remove"
    - button "DOP Remove":
      - text: ""
      - button "Remove"
    - button "DOC Remove":
      - text: ""
      - button "Remove"
    - button "EPD Remove":
      - text: ""
      - button "Remove"
    - button "Categories Remove":
      - text: ""
      - button "Remove"
    - button "Product Selections Remove":
      - text: ""
      - button "Remove"
    - button "1867_sap_characteristic_znkt_millca_standard_length Remove":
      - text: ""
      - button "Remove"
    - button "Length [m] (0000_length) Remove":
      - text: ""
      - button "Remove"
    - button "0000_drum_type Remove":
      - text: ""
      - button "Remove"
    - button "Descriptions Remove":
      - text: ""
      - button "Remove"
    - button "0000_application Remove":
      - text: ""
      - button "Remove"
    - button "0000_application_2 Remove":
      - text: ""
      - button "Remove"
    - button "0000_sales_unit Remove":
      - text: ""
      - button "Remove"
    - button "0000_base_uom Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section [mm²] (92_cross_section) Remove":
      - text: ""
      - button "Remove"
    - button "Number of cores (91_number_of_cores) Remove":
      - text: ""
      - button "Remove"
    - button "No. of cores and cross-section [mm²] (661_no_of_cores_and_cross_section) Remove":
      - text: ""
      - button "Remove"
    - button "842_colour_of_sheath Remove":
      - text: ""
      - button "Remove"
    - button "49_colour_identification_of_cores Remove":
      - text: ""
      - button "Remove"
    - button "14_material_of_conductor Remove":
      - text: ""
      - button "Remove"
    - button "1607_cpr_classification Remove":
      - text: ""
      - button "Remove"
    - button "Shape of conductor (18_shape_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Voltage U [kV] (15_voltage_u) Remove":
      - text: ""
      - button "Remove"
    - button "Voltage U₀ [kV] (1296_voltage_uo) Remove":
      - text: ""
      - button "Remove"
    - button "Rated voltage U₀/U [kV] (835_rated_voltage_uo_u) Remove":
      - text: ""
      - button "Remove"
    - button "Voltage U(V) [V] (1346_voltage_u_v) Remove":
      - text: ""
      - button "Remove"
    - button "Test voltage [kV] (627_test_voltage) Remove":
      - text: ""
      - button "Remove"
    - button "Maximal voltage [kV] (1251_maximal_voltage) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter informative [mm] (657_diameter_informative) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter [mm] (9_diameter) Remove":
      - text: ""
      - button "Remove"
    - button "Weight informative [kg/km] (483_weight_informative) Remove":
      - text: ""
      - button "Remove"
    - button "Weight [kg] (28_weight) Remove":
      - text: ""
      - button "Remove"
    - button "719_certificate Remove":
      - text: ""
      - button "Remove"
    - button "Norm (standard) (96_norm_standard) Remove":
      - text: ""
      - button "Remove"
    - button "1860_declaration_of_conformity Remove":
      - text: ""
      - button "Remove"
    - button "1252_declaration_of_conformity_ue_ce Remove":
      - text: ""
      - button "Remove"
    - button "Declaration of Conformity UE (CE) (2992_label_logotype_1) Remove":
      - text: ""
      - button "Remove"
    - button "721_reach Remove":
      - text: ""
      - button "Remove"
    - button "720_rohs Remove":
      - text: ""
      - button "Remove"
    - button "Material insulation (1000_material_insulation) Remove":
      - text: ""
      - button "Remove"
    - button "632_colour_of_insulation Remove":
      - text: ""
      - button "Remove"
    - button "Thickness - nominal insulation [mm] (61_thickness_nominal_insulation) Remove":
      - text: ""
      - button "Remove"
    - button "1001_material_sheath Remove":
      - text: ""
      - button "Remove"
    - button "Nominal thickness of sheath [mm] (1019_nominal_thickness_of_sheath) Remove":
      - text: ""
      - button "Remove"
    - button "Thickness - nominal sheath [mm] (62_thickness_nominal_sheath) Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section of screen [mm²] (22_cross_section_of_screen) Remove":
      - text: ""
      - button "Remove"
    - button "1427_type_of_screen Remove":
      - text: ""
      - button "Remove"
    - button "1428_material_of_screen Remove":
      - text: ""
      - button "Remove"
    - button "629_temperature_range Remove":
      - text: ""
      - button "Remove"
    - button "Operating cond. temperature max. [°C] (853_operating_cond_temperature_max) Remove":
      - text: ""
      - button "Remove"
    - button "Maximal short-circuit temperature [°C] (628_maximal_short_circuit_temperature) Remove":
      - text: ""
      - button "Remove"
    - button "Maximal operating conductor temperature [°C] (643_maximal_operating_conductor_temperature) Remove":
      - text: ""
      - button "Remove"
    - button "Minimal temperature for laying and manipulation [°C] (630_minimal_temperature_for_laying_and_manipulation) Remove":
      - text: ""
      - button "Remove"
    - button "Minimal storage temperature [°C] (631_minimal_storage_temperature) Remove":
      - text: ""
      - button "Remove"
    - button /Max\\. effective resistance conductor at \\d+°C \\[Ω\\/km\\] \\(63_max_effective_resistance_conductor_at_20_c\\) Remove/:
      - text: ""
      - button "Remove"
    - button /Max\\. effective resistance screen at \\d+°C \\[Ω\\/km\\] \\(99_max_effective_resistance_screen_at_20_c\\) Remove/:
      - text: ""
      - button "Remove"
    - button /Max\\. resistance of screening at \\d+ °C \\[Ω\\/km\\] \\(1115_max_resistance_of_screening_at_20_c\\) Remove/:
      - text: ""
      - button "Remove"
    - button "Height of cable [mm] (1338_height_of_cable) Remove":
      - text: ""
      - button "Remove"
    - button "Width of cable [mm] (1341_width_of_cable) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter of conductor [mm] (87_diameter_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter (height) of conductor [mm] (349_diameter_height_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Shape of reduced conductor (93_shape_of_reduced_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section of reduced conductor [mm²] (88_cross_section_of_reduced_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Corrosivity of emitted gases (640_corrosivity_of_emitted_gases) Remove":
      - text: ""
      - button "Remove"
    - button "Conductivity - pH change (2263_conductivity_ph_change) Remove":
      - text: ""
      - button "Remove"
    - button "Smoke density (637_smoke_density) Remove":
      - text: ""
      - button "Remove"
    - button "635_self_extinguishing_of_one_cable Remove":
      - text: ""
      - button "Remove"
    - button "Self-extinguishing of bunched cables (636_self_extinguishing_of_bunched_cables) Remove":
      - text: ""
      - button "Remove"
    - button "656_uv_stability Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in ground - trefoil [A] (732_current_carrying_capacity_in_ground_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in ground - flat [A] (733_current_carrying_capacity_in_ground_flat) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in air - trefoil [A] (683_current_carrying_capacity_in_air_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in air - flat [A] (684_current_carrying_capacity_in_air_flat) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity single cable in air [A] (650_current_carrying_capacity_single_cable_in_air) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity single cable in ground [A] (651_current_carrying_capacity_single_cable_in_ground) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance [mH/km] (653_inductivity) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance (in trefoil) [mH/km] (1245_cable_inductance_in_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance - trefoil [mH/km] (685_inductivity_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance on air (side by side) [mH/km] (1247_cable_inductance_on_air_side_by_side) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance in ground (side by side) [mH/km] (1248_cable_inductance_in_ground_side_by_side) Remove":
      - text: ""
      - button "Remove"
    - button "Minimal radius of bend [mm] (647_minimal_radius_of_bend) Remove":
      - text: ""
      - button "Remove"
    - button /Short circuit current \\(\\d+[hmsp]+\\) \\[kA\\] \\(648_short_circuit_current_1s\\) Remove/:
      - text: ""
      - button "Remove"
    - button /Short circuit current of screening \\(\\d+[hmsp]+\\) \\[kA\\] \\(669_short_circuit_current_of_screening\\) Remove/:
      - text: ""
      - button "Remove"
    - button "Capacitance [mikroF/km] (652_capacity) Remove":
      - text: ""
      - button "Remove"
    - button "Thickness of inner semicond. manufacturing [mm] (1253_thickness_of_inner_semicond_manufacturing) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter over insulation inf. [mm] (1256_diameter_over_insulation_inf) Remove":
      - text: ""
      - button "Remove"
    - button "Insulation resistance cable [GΩ/km] (1290_insulation_resistance_cable) Remove":
      - text: ""
      - button "Remove"
    - button "Pulling force allowed [kN] (1295_pulling_force_allowed) Remove":
      - text: ""
      - button "Remove"
    - button "Fire test (1013_fire_test) Remove":
      - text: ""
      - button "Remove"
    - button "638_circuit_integrity_in_case_of_a_fire_fe180 Remove":
      - text: ""
      - button "Remove"
    - button "639_system_integrity_in_case_of_a_fire Remove":
      - text: ""
      - button "Remove"
    - button "641_improved_safety_in_case_of_fire_cpr Remove":
      - text: ""
      - button "Remove"
    - button "Max. permitted pulling force [N] (718_max_permitted_pulling_force) Remove":
      - text: ""
      - button "Remove"
    - button "Zero sequence resistance (R0) [Ω/km] (662_zero_sequence_resistance_r0) Remove":
      - text: ""
      - button "Remove"
    - button "Positive sequence resistance (R1) [Ω/km] (663_positive_sequence_resistance_r1) Remove":
      - text: ""
      - button "Remove"
    - button "Zero sequence reactance (X0) [Ω/km] (664_zero_sequence_reactance_x0) Remove":
      - text: ""
      - button "Remove"
    - button "Positive sequence reactance (X1) [Ω/km] (665_positive_sequence_reactance_x1) Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section AWG (1456_cross_section_awg) Remove":
      - text: ""
      - button "Remove"
    - button "Tensile strength [N] (550_tensile_strength) Remove":
      - text: ""
      - button "Remove"
    - button "esp_greased Remove":
      - text: ""
      - button "Remove"
    - button "esp_grease_application_type Remove":
      - text: ""
      - button "Remove"
    - button "Number of wires of conductor (73_number_of_wires_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Al alloy type (esp_al_alloy_type) Remove":
      - text: ""
      - button "Remove"
    - button "esp_core_material Remove":
      - text: ""
      - button "Remove"
    - button "Steel type (esp_steel_type) Remove":
      - text: ""
      - button "Remove"
    - button "Al type (esp_al_type) Remove":
      - text: ""
      - button "Remove"
    - button "ACS type (esp_acs_type) Remove":
      - text: ""
      - button "Remove"
    - button "Number of fibers (esp_number_of_fibers) Remove":
      - text: ""
      - button "Remove"
    - button "Type of fiber (esp_type_of_fiber) Remove":
      - text: ""
      - button "Remove"
    - button "1430_longitudinal_water_blocking_conductor Remove":
      - text: ""
      - button "Remove"
    - button "1429_type_of_semiconductive_layer_over_insulation Remove":
      - text: ""
      - button "Remove"
    - button "1431_longitudinal_water_blocking_screen Remove":
      - text: ""
      - button "Remove"
    - button "1432_radial_water_blocking Remove":
      - text: ""
      - button "Remove"
    - button "esp_mechanical_protection Remove":
      - text: ""
      - button "Remove"
    - button "esp_semiconductive_screen_over_sheath Remove":
      - text: ""
      - button "Remove"
    - button "esp_type_of_armour Remove":
      - text: ""
      - button "Remove"
    - button "esp_anti_rodent_termite_sheath_additive Remove":
      - text: ""
      - button "Remove"
    - button "2450_electric_current_type Remove":
      - text: ""
      - button "Remove"
    `;

const columnOrdererComponentScreenshot2 = `
    - button "key Remove":
      - text: ""
      - button "Remove"
    - button "Product Type Key Remove":
      - text: ""
      - button "Remove"
    - button "SKU Remove":
      - text: ""
      - button "Remove"
    - button "Product Name Remove":
      - text: ""
      - button "Remove"
    - button "Product Type Name Remove":
      - text: ""
      - button "Remove"
    - button "Number of group of product (544_number_of_group_of_product) Remove":
      - text: ""
      - button "Remove"
    - button "Type (7_type) Remove":
      - text: ""
      - button "Remove"
    - button "23_specification Remove":
      - text: ""
      - button "Remove"
    - button "EAN (0000_barcode_ean_code) Remove":
      - text: ""
      - button "Remove"
    - button "EL (0000_branch_code) Remove":
      - text: ""
      - button "Remove"
    - button "Country specific (0000_country_specific) Remove":
      - text: ""
      - button "Remove"
    - button "Customer specific (0000_customer_specific) Remove":
      - text: ""
      - button "Remove"
    - button "Plants (0000_plants) Remove":
      - text: ""
      - button "Remove"
    - button "Plants status (0000_plants_status) Remove":
      - text: ""
      - button "Remove"
    - button "Sales orgs (0000_sales_orgs) Remove":
      - text: ""
      - button "Remove"
    - button "Sales org status (0000_sales_org_status) Remove":
      - text: ""
      - button "Remove"
    - button "Replacement (0000_replacement) Remove":
      - text: ""
      - button "Remove"
    - button "Image Remove":
      - text: ""
      - button "Remove"
    - button "Datasheet Remove":
      - text: ""
      - button "Remove"
    - button "DOP Remove":
      - text: ""
      - button "Remove"
    - button "DOC Remove":
      - text: ""
      - button "Remove"
    - button "EPD Remove":
      - text: ""
      - button "Remove"
    - button "Categories Remove":
      - text: ""
      - button "Remove"
    - button "Product Selections Remove":
      - text: ""
      - button "Remove"
    - button "1867_sap_characteristic_znkt_millca_standard_length Remove":
      - text: ""
      - button "Remove"
    - button "Length [m] (0000_length) Remove":
      - text: ""
      - button "Remove"
    - button "0000_drum_type Remove":
      - text: ""
      - button "Remove"
    - button "Descriptions Remove":
      - text: ""
      - button "Remove"
    - button "0000_application Remove":
      - text: ""
      - button "Remove"
    - button "0000_application_2 Remove":
      - text: ""
      - button "Remove"
    - button "0000_sales_unit Remove":
      - text: ""
      - button "Remove"
    - button "0000_base_uom Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section [mm²] (92_cross_section) Remove":
      - text: ""
      - button "Remove"
    - button "Number of cores (91_number_of_cores) Remove":
      - text: ""
      - button "Remove"
    - button "No. of cores and cross-section [mm²] (661_no_of_cores_and_cross_section) Remove":
      - text: ""
      - button "Remove"
    - button "842_colour_of_sheath Remove":
      - text: ""
      - button "Remove"
    - button "49_colour_identification_of_cores Remove":
      - text: ""
      - button "Remove"
    - button "14_material_of_conductor Remove":
      - text: ""
      - button "Remove"
    - button "1607_cpr_classification Remove":
      - text: ""
      - button "Remove"
    - button "Shape of conductor (18_shape_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Voltage U [kV] (15_voltage_u) Remove":
      - text: ""
      - button "Remove"
    - button "Voltage U₀ [kV] (1296_voltage_uo) Remove":
      - text: ""
      - button "Remove"
    - button "Rated voltage U₀/U [kV] (835_rated_voltage_uo_u) Remove":
      - text: ""
      - button "Remove"
    - button "Voltage U(V) [V] (1346_voltage_u_v) Remove":
      - text: ""
      - button "Remove"
    - button "Test voltage [kV] (627_test_voltage) Remove":
      - text: ""
      - button "Remove"
    - button "Maximal voltage [kV] (1251_maximal_voltage) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter informative [mm] (657_diameter_informative) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter [mm] (9_diameter) Remove":
      - text: ""
      - button "Remove"
    - button "Weight informative [kg/km] (483_weight_informative) Remove":
      - text: ""
      - button "Remove"
    - button "Weight [kg] (28_weight) Remove":
      - text: ""
      - button "Remove"
    - button "719_certificate Remove":
      - text: ""
      - button "Remove"
    - button "Norm (standard) (96_norm_standard) Remove":
      - text: ""
      - button "Remove"
    - button "1860_declaration_of_conformity Remove":
      - text: ""
      - button "Remove"
    - button "1252_declaration_of_conformity_ue_ce Remove":
      - text: ""
      - button "Remove"
    - button "Declaration of Conformity UE (CE) (2992_label_logotype_1) Remove":
      - text: ""
      - button "Remove"
    - button "721_reach Remove":
      - text: ""
      - button "Remove"
    - button "720_rohs Remove":
      - text: ""
      - button "Remove"
    - button "Material insulation (1000_material_insulation) Remove":
      - text: ""
      - button "Remove"
    - button "632_colour_of_insulation Remove":
      - text: ""
      - button "Remove"
    - button "Thickness - nominal insulation [mm] (61_thickness_nominal_insulation) Remove":
      - text: ""
      - button "Remove"
    - button "1001_material_sheath Remove":
      - text: ""
      - button "Remove"
    - button "Nominal thickness of sheath [mm] (1019_nominal_thickness_of_sheath) Remove":
      - text: ""
      - button "Remove"
    - button "Thickness - nominal sheath [mm] (62_thickness_nominal_sheath) Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section of screen [mm²] (22_cross_section_of_screen) Remove":
      - text: ""
      - button "Remove"
    - button "1427_type_of_screen Remove":
      - text: ""
      - button "Remove"
    - button "1428_material_of_screen Remove":
      - text: ""
      - button "Remove"
    - button "629_temperature_range Remove":
      - text: ""
      - button "Remove"
    - button "Operating cond. temperature max. [°C] (853_operating_cond_temperature_max) Remove":
      - text: ""
      - button "Remove"
    - button "Maximal short-circuit temperature [°C] (628_maximal_short_circuit_temperature) Remove":
      - text: ""
      - button "Remove"
    - button "Maximal operating conductor temperature [°C] (643_maximal_operating_conductor_temperature) Remove":
      - text: ""
      - button "Remove"
    - button "Minimal temperature for laying and manipulation [°C] (630_minimal_temperature_for_laying_and_manipulation) Remove":
      - text: ""
      - button "Remove"
    - button "Minimal storage temperature [°C] (631_minimal_storage_temperature) Remove":
      - text: ""
      - button "Remove"
    - button /Max\\. effective resistance conductor at \\d+°C \\[Ω\\/km\\] \\(63_max_effective_resistance_conductor_at_20_c\\) Remove/:
      - text: ""
      - button "Remove"
    - button /Max\\. effective resistance screen at \\d+°C \\[Ω\\/km\\] \\(99_max_effective_resistance_screen_at_20_c\\) Remove/:
      - text: ""
      - button "Remove"
    - button /Max\\. resistance of screening at \\d+ °C \\[Ω\\/km\\] \\(1115_max_resistance_of_screening_at_20_c\\) Remove/:
      - text: ""
      - button "Remove"
    - button "Height of cable [mm] (1338_height_of_cable) Remove":
      - text: ""
      - button "Remove"
    - button "Width of cable [mm] (1341_width_of_cable) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter of conductor [mm] (87_diameter_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter (height) of conductor [mm] (349_diameter_height_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Shape of reduced conductor (93_shape_of_reduced_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section of reduced conductor [mm²] (88_cross_section_of_reduced_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Corrosivity of emitted gases (640_corrosivity_of_emitted_gases) Remove":
      - text: ""
      - button "Remove"
    - button "Conductivity - pH change (2263_conductivity_ph_change) Remove":
      - text: ""
      - button "Remove"
    - button "Smoke density (637_smoke_density) Remove":
      - text: ""
      - button "Remove"
    - button "635_self_extinguishing_of_one_cable Remove":
      - text: ""
      - button "Remove"
    - button "Self-extinguishing of bunched cables (636_self_extinguishing_of_bunched_cables) Remove":
      - text: ""
      - button "Remove"
    - button "656_uv_stability Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in ground - trefoil [A] (732_current_carrying_capacity_in_ground_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in ground - flat [A] (733_current_carrying_capacity_in_ground_flat) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in air - trefoil [A] (683_current_carrying_capacity_in_air_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity in air - flat [A] (684_current_carrying_capacity_in_air_flat) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity single cable in air [A] (650_current_carrying_capacity_single_cable_in_air) Remove":
      - text: ""
      - button "Remove"
    - button "Current carrying capacity single cable in ground [A] (651_current_carrying_capacity_single_cable_in_ground) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance [mH/km] (653_inductivity) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance (in trefoil) [mH/km] (1245_cable_inductance_in_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance - trefoil [mH/km] (685_inductivity_trefoil) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance on air (side by side) [mH/km] (1247_cable_inductance_on_air_side_by_side) Remove":
      - text: ""
      - button "Remove"
    - button "Inductance in ground (side by side) [mH/km] (1248_cable_inductance_in_ground_side_by_side) Remove":
      - text: ""
      - button "Remove"
    - button "Minimal radius of bend [mm] (647_minimal_radius_of_bend) Remove":
      - text: ""
      - button "Remove"
    - button /Short circuit current \\(\\d+[hmsp]+\\) \\[kA\\] \\(648_short_circuit_current_1s\\) Remove/:
      - text: ""
      - button "Remove"
    - button /Short circuit current of screening \\(\\d+[hmsp]+\\) \\[kA\\] \\(669_short_circuit_current_of_screening\\) Remove/:
      - text: ""
      - button "Remove"
    - button "Capacitance [mikroF/km] (652_capacity) Remove":
      - text: ""
      - button "Remove"
    - button "Thickness of inner semicond. manufacturing [mm] (1253_thickness_of_inner_semicond_manufacturing) Remove":
      - text: ""
      - button "Remove"
    - button "Diameter over insulation inf. [mm] (1256_diameter_over_insulation_inf) Remove":
      - text: ""
      - button "Remove"
    - button "Insulation resistance cable [GΩ/km] (1290_insulation_resistance_cable) Remove":
      - text: ""
      - button "Remove"
    - button "Pulling force allowed [kN] (1295_pulling_force_allowed) Remove":
      - text: ""
      - button "Remove"
    - button "Fire test (1013_fire_test) Remove":
      - text: ""
      - button "Remove"
    - button "638_circuit_integrity_in_case_of_a_fire_fe180 Remove":
      - text: ""
      - button "Remove"
    - button "639_system_integrity_in_case_of_a_fire Remove":
      - text: ""
      - button "Remove"
    - button "641_improved_safety_in_case_of_fire_cpr Remove":
      - text: ""
      - button "Remove"
    - button "Max. permitted pulling force [N] (718_max_permitted_pulling_force) Remove":
      - text: ""
      - button "Remove"
    - button "Zero sequence resistance (R0) [Ω/km] (662_zero_sequence_resistance_r0) Remove":
      - text: ""
      - button "Remove"
    - button "Positive sequence resistance (R1) [Ω/km] (663_positive_sequence_resistance_r1) Remove":
      - text: ""
      - button "Remove"
    - button "Zero sequence reactance (X0) [Ω/km] (664_zero_sequence_reactance_x0) Remove":
      - text: ""
      - button "Remove"
    - button "Positive sequence reactance (X1) [Ω/km] (665_positive_sequence_reactance_x1) Remove":
      - text: ""
      - button "Remove"
    - button "Cross-section AWG (1456_cross_section_awg) Remove":
      - text: ""
      - button "Remove"
    - button "Tensile strength [N] (550_tensile_strength) Remove":
      - text: ""
      - button "Remove"
    - button "esp_greased Remove":
      - text: ""
      - button "Remove"
    - button "esp_grease_application_type Remove":
      - text: ""
      - button "Remove"
    - button "Number of wires of conductor (73_number_of_wires_of_conductor) Remove":
      - text: ""
      - button "Remove"
    - button "Al alloy type (esp_al_alloy_type) Remove":
      - text: ""
      - button "Remove"
    - button "esp_core_material Remove":
      - text: ""
      - button "Remove"
    - button "Steel type (esp_steel_type) Remove":
      - text: ""
      - button "Remove"
    - button "Al type (esp_al_type) Remove":
      - text: ""
      - button "Remove"
    - button "ACS type (esp_acs_type) Remove":
      - text: ""
      - button "Remove"
    - button "Number of fibers (esp_number_of_fibers) Remove":
      - text: ""
      - button "Remove"
    - button "Type of fiber (esp_type_of_fiber) Remove":
      - text: ""
      - button "Remove"
    - button "1430_longitudinal_water_blocking_conductor Remove":
      - text: ""
      - button "Remove"
    - button "1429_type_of_semiconductive_layer_over_insulation Remove":
      - text: ""
      - button "Remove"
    - button "1431_longitudinal_water_blocking_screen Remove":
      - text: ""
      - button "Remove"
    - button "1432_radial_water_blocking Remove":
      - text: ""
      - button "Remove"
    - button "esp_mechanical_protection Remove":
      - text: ""
      - button "Remove"
    - button "esp_semiconductive_screen_over_sheath Remove":
      - text: ""
      - button "Remove"
    - button "esp_type_of_armour Remove":
      - text: ""
      - button "Remove"
    - button "esp_anti_rodent_termite_sheath_additive Remove":
      - text: ""
      - button "Remove"
    - button "2450_electric_current_type Remove":
      - text: ""
      - button "Remove"
    `;

const columns = [
  'key1',
  'SKU',
  'Product Name (EN)',
  'Product Type Key',
  'Product Type Name',
  'Number of group of product (544_number_of_group_of_product)',
  'Type (7_type)',
  'Specification (en)',
  'EAN (0000_barcode_ean_code)',
  'EL (0000_branch_code)',
  'Country specific (0000_country_specific)',
  'Customer specific (0000_customer_specific)',
  'Plants (0000_plants)',
  'Plants status (0000_plants_status)',
  'Sales orgs (0000_sales_orgs)',
  'Sales org status (0000_sales_org_status)',
  'Replacement (0000_replacement)',
  'Image',
  'Datasheet',
  'DOP',
  'DOC',
  'EPD',
  'Categories',
  'Product Selections',
  'Length type (en)',
  'Length [m] (0000_length)',
  'Packaging (en)',
  'Descriptions (EN)',
  'Application (en)',
  'Application (en)',
  'Sales unit (en)',
  'Base UoM (en)',
  'Cross-section [mm²] (92_cross_section)',
  'Number of cores (91_number_of_cores)',
  'No. of cores and cross-section [mm²] (661_no_of_cores_and_cross_section)',
  'Colour of sheath (en)',
  'Colour identification of cores (en)',
  'Material of conductor (en)',
  'CPR-Classification (en)',
  'Shape of conductor (18_shape_of_conductor)',
  'Voltage U [kV] (15_voltage_u)',
  'Voltage U₀ [kV] (1296_voltage_uo)',
  'Rated voltage U₀/U [kV] (835_rated_voltage_uo_u)',
  'Test voltage [kV] (627_test_voltage)',
  'Maximal voltage [kV] (1251_maximal_voltage)',
  'Diameter informative [mm] (657_diameter_informative)',
  'Diameter [mm] (9_diameter)',
  'Weight informative [kg/km] (483_weight_informative)',
  'Weight [kg] (28_weight)',
  'Certificate (en)',
  'Norm (standard) (96_norm_standard)',
  'Declaration of Conformity UE (CE) (en)',
  'Declaration of Conformity UE (CE) (2992_label_logotype_1)',
  'REACH (en)',
  'RoHS (en)',
  'Material insulation (1000_material_insulation)',
  'Colour of insulation (en)',
  'Thickness - nominal insulation [mm] (61_thickness_nominal_insulation)',
  'Material sheath (en)',
  'Thickness - nominal sheath [mm] (62_thickness_nominal_sheath)',
  'Cross-section of screen [mm²] (22_cross_section_of_screen)',
  'Type of screen (en)',
  'Material of screen (en)',
  'Temperature range (en)',
  'Operating cond. temperature max. [°C] (853_operating_cond_temperature_max)',
  'Maximal short-circuit temperature [°C] (628_maximal_short_circuit_temperature)',
  'Maximal operating conductor temperature [°C] (643_maximal_operating_conductor_temperature)',
  'Minimal temperature for laying and manipulation [°C] (630_minimal_temperature_for_laying_and_manipulation)',
  'Minimal storage temperature [°C] (631_minimal_storage_temperature)',
  'Max. effective resistance conductor at 20°C [Ω/km] (63_max_effective_resistance_conductor_at_20_c)',
  'Max. effective resistance screen at 20°C [Ω/km] (99_max_effective_resistance_screen_at_20_c)',
  'Diameter (height) of conductor [mm] (349_diameter_height_of_conductor)',
  'Self-extinguishing of one cable (en)',
  'UV stability (en)',
  'Current carrying capacity single cable in air [A] (650_current_carrying_capacity_single_cable_in_air)',
  'Current carrying capacity single cable in ground [A] (651_current_carrying_capacity_single_cable_in_ground)',
  'Inductance [mH/km] (653_inductivity)',
  'Minimal radius of bend [mm] (647_minimal_radius_of_bend)',
  'Short circuit current (1s) [kA] (648_short_circuit_current_1s)',
  'Short circuit current of screening (1s) [kA] (669_short_circuit_current_of_screening)',
  'Capacitance [mikroF/km] (652_capacity)',
  'Max. permitted pulling force [N] (718_max_permitted_pulling_force)',
  'Zero sequence resistance (R0) [Ω/km] (662_zero_sequence_resistance_r0)',
  'Positive sequence resistance (R1) [Ω/km] (663_positive_sequence_resistance_r1)',
  'Zero sequence reactance (X0) [Ω/km] (664_zero_sequence_reactance_x0)',
  'Positive sequence reactance (X1) [Ω/km] (665_positive_sequence_reactance_x1)',
];

const columns2 = [
  'key1',
  'Product Type Key',
  'SKU',
  'Product Name (EN)',
  'Number of group of product (544_number_of_group_of_product)',
  'Type (7_type)',
  'Specification (en)',
  'EAN (0000_barcode_ean_code)',
  'EL (0000_branch_code)',
  'Country specific (0000_country_specific)',
  'Customer specific (0000_customer_specific)',
  'Plants (0000_plants)',
  'Plants status (0000_plants_status)',
  'Sales orgs (0000_sales_orgs)',
  'Sales org status (0000_sales_org_status)',
  'Replacement (0000_replacement)',
  'Image',
  'Datasheet',
  'DOP',
  'DOC',
  'EPD',
  'Categories',
  'Product Selections',
  'Length type (en)',
  'Length [m] (0000_length)',
  'Packaging (en)',
  'Descriptions (EN)',
  'Application (en)',
  'Application (en)',
  'Sales unit (en)',
  'Base UoM (en)',
  'Cross-section [mm²] (92_cross_section)',
  'Number of cores (91_number_of_cores)',
  'No. of cores and cross-section [mm²] (661_no_of_cores_and_cross_section)',
  'Colour of sheath (en)',
  'Colour identification of cores (en)',
  'Material of conductor (en)',
  'CPR-Classification (en)',
  'Shape of conductor (18_shape_of_conductor)',
  'Voltage U [kV] (15_voltage_u)',
  'Voltage U₀ [kV] (1296_voltage_uo)',
  'Rated voltage U₀/U [kV] (835_rated_voltage_uo_u)',
  'Test voltage [kV] (627_test_voltage)',
  'Maximal voltage [kV] (1251_maximal_voltage)',
  'Diameter informative [mm] (657_diameter_informative)',
  'Diameter [mm] (9_diameter)',
  'Weight informative [kg/km] (483_weight_informative)',
  'Weight [kg] (28_weight)',
  'Certificate (en)',
  'Norm (standard) (96_norm_standard)',
  'Declaration of Conformity UE (CE) (en)',
  'Declaration of Conformity UE (CE) (2992_label_logotype_1)',
  'REACH (en)',
  'RoHS (en)',
  'Material insulation (1000_material_insulation)',
  'Colour of insulation (en)',
  'Thickness - nominal insulation [mm] (61_thickness_nominal_insulation)',
  'Material sheath (en)',
  'Thickness - nominal sheath [mm] (62_thickness_nominal_sheath)',
  'Cross-section of screen [mm²] (22_cross_section_of_screen)',
  'Type of screen (en)',
  'Material of screen (en)',
  'Temperature range (en)',
  'Operating cond. temperature max. [°C] (853_operating_cond_temperature_max)',
  'Maximal short-circuit temperature [°C] (628_maximal_short_circuit_temperature)',
  'Maximal operating conductor temperature [°C] (643_maximal_operating_conductor_temperature)',
  'Minimal temperature for laying and manipulation [°C] (630_minimal_temperature_for_laying_and_manipulation)',
  'Minimal storage temperature [°C] (631_minimal_storage_temperature)',
  'Max. effective resistance conductor at 20°C [Ω/km] (63_max_effective_resistance_conductor_at_20_c)',
  'Max. effective resistance screen at 20°C [Ω/km] (99_max_effective_resistance_screen_at_20_c)',
  'Diameter (height) of conductor [mm] (349_diameter_height_of_conductor)',
  'Self-extinguishing of one cable (en)',
  'UV stability (en)',
  'Current carrying capacity single cable in air [A] (650_current_carrying_capacity_single_cable_in_air)',
  'Current carrying capacity single cable in ground [A] (651_current_carrying_capacity_single_cable_in_ground)',
  'Inductance [mH/km] (653_inductivity)',
  'Minimal radius of bend [mm] (647_minimal_radius_of_bend)',
  'Short circuit current (1s) [kA] (648_short_circuit_current_1s)',
  'Short circuit current of screening (1s) [kA] (669_short_circuit_current_of_screening)',
  'Capacitance [mikroF/km] (652_capacity)',
  'Max. permitted pulling force [N] (718_max_permitted_pulling_force)',
  'Zero sequence resistance (R0) [Ω/km] (662_zero_sequence_resistance_r0)',
  'Positive sequence resistance (R1) [Ω/km] (663_positive_sequence_resistance_r1)',
  'Zero sequence reactance (X0) [Ω/km] (664_zero_sequence_reactance_x0)',
  'Positive sequence reactance (X1) [Ω/km] (665_positive_sequence_reactance_x1)',
];

test('column-default-order', async ({ page }) => {
  await openAllProductsScreen(page);

  //apply all attributes
  await openAttributesFilter(page);
  await page.getByRole('button', { name: 'Apply All', exact: true }).click();

  await checkTableHeaders(page, COLUMN_ORDER, 1);
});

test('column-order-manual-change', async ({ page }) => {
  await openAllProductsScreen(page);

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Add filter' }).click();
  await page.getByRole('option', { name: 'Attributes' }).click();
  await page.getByRole('button', { name: 'Apply All' }).click();
  await page.getByRole('button', { name: 'Apply All' }).click();
  await page
    .getByRole('option', { name: 'EAN (0000_barcode_ean_code)' })
    .locator('label')
    .click();
  await page
    .getByRole('option', { name: 'EL (0000_branch_code)' })
    .locator('label')
    .click();
  await page
    .getByRole('option', { name: 'Number of cores (' })
    .locator('label')
    .click();
  await page
    .getByRole('option', { name: 'EL (0000_branch_code)' })
    .locator('label')
    .click();

  //column orderer button
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();

  await expect(page.getByTestId('selected-columns-panel')).toMatchAriaSnapshot(
    columnOrdererComponentScreenshot
  );

  //close the column orderer
  await page.getByRole('button', { name: 'Close' }).click();

  //column key filter
  await page
    .locator('span:nth-child(3) > .css-eonqw7-getIconStyles > path')
    .first()
    .click();
  await page.getByText('110120000').click();
  await page.getByRole('button', { name: 'Apply' }).click();

  //check the columns in the table
  await checkTableHeaders(page, columns);

  //check hidden columns
  await page.getByText('Hidden 50 attribute columns');

  //column orderer button
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();

  //change the order of columns
  await dragToReorder(page, 'Product Type Key', 'SKU');

  await expect(page.getByTestId('selected-columns-panel')).toMatchAriaSnapshot(
    columnOrdererComponentScreenshot2
  );

  //remove a column
  await page
    .getByRole('button', { name: 'Product Type Name Remove' })
    .getByLabel('Remove', { exact: true })
    .click();

  //hidden columns
  await expect(page.getByTestId('hidden-columns-panel')).toMatchAriaSnapshot(
    `- button "Product Type Name"`
  );

  //check the columns in the table
  await checkTableHeaders(page, columns2);
});
