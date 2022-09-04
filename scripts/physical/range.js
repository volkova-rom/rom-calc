function display_tier3(tier3_data) {
    var base_value = tier3_data["base_value"];
    var part1_modifiers = tier3_data["part1_modifiers"];
    var part2_modifiers = tier3_data["part2_modifiers"];
    var vit_reduction = tier3_data["defender_vit_reduction"];
    var total_value = tier3_data["total_value"];

    return `((base=${base_value} * part1_modifiers=${part1_modifiers}) - vit_reduction=${vit_reduction}) * part2_modifiers=${part2_modifiers} = ${total_value}`;
}

function update_all() {
    var with_prefix = false;
    var attacker_data = retrieve_all_elements_by_class("attacker", with_prefix);
    var defender_data = retrieve_all_elements_by_class("defender", with_prefix);

    var tier1_data = calc_standard_physical_tier1(attacker_data, defender_data);
    update_as_computed(tier1_data);
    var tier1_value = tier1_data["total_value"];
    document.getElementById("display.tier1").textContent = display_generic_tier(tier1_data);
    
    var tier2_data = calc_standard_range_tier2(tier1_value, attacker_data, defender_data);
    update_as_computed(tier2_data);
    var tier2_value = tier2_data["total_value"];
    document.getElementById("display.tier2").textContent = display_generic_tier(tier2_data);

    var damage_ratios = ratio_entries(tier2_data);

    var tier3_data = calc_standard_range_tier3(tier2_value, attacker_data, defender_data);
    update_as_computed(tier3_data);
    var tier3_value = tier3_data["total_value"];
    document.getElementById("display.tier3").textContent = display_tier3(tier3_data);

    damage_ratios["ratio_previous"] = tier3_data["ratio_previous"];
    damage_ratios = ratio_entries(damage_ratios);
    damage_ratios["ratio_refine_atk"] = tier3_data["ratio_refine_atk"];

    var tier4_data = calc_standard_skill_tier4(tier3_value, attacker_data, defender_data);
    update_as_computed(tier4_data);
    var tier4_value = tier4_data["total_value"];
    var final_value = parseInt(tier4_value);
    document.getElementById("display.tier4").textContent = display_generic_final_tier(tier4_data);

    damage_ratios["ratio_previous"] = tier4_data["ratio_previous"];
    damage_ratios = ratio_entries(damage_ratios);
    damage_ratios["ratio_true_dmg"] = tier4_data["ratio_true_dmg"];

    document.getElementById("display.status_dmg_modifier").textContent = "(" + tier4_data["status_dmg_type"] + ") " + tier4_data["status_dmg_modifier"];

    document.getElementById("computed.final").textContent = final_value.toLocaleString("en-US");
    var pretty_damage_ratios = {}
    for(var current_damage_ratio in damage_ratios) {
        pretty_damage_ratios[current_damage_ratio] = standard_float(damage_ratios[current_damage_ratio]* 100.00);
    }
    update_as_computed(pretty_damage_ratios);
    update_duplicates();
}

function capture_attacker_data() {
    standard_capture_attacker_data();
}

function load_attacker_data() {
    standard_load_attacker_data();
    update_all();
}

function capture_defender_data() {
    standard_capture_defender_data();
}

function load_defender_data() {
    standard_load_defender_data();
    update_all();
}
