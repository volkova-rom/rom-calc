function calc_carnage_capoeira_tier3_part1(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var refine_atk = attacker_data["refine_atk"];

    var refine_reduction = calc_defender_refine_reduction(defender_data);
    var range_redu = "range_redu" in defender_data ? defender_data["range_redu"] : 0.00
    var range_modifier = calc_generic_modifier(attacker_data["pdi"], range_redu);

    var stat_agi = standard_float(attacker_data["stat_agi"]);
    var desperado_agi_modifier = standard_float(stat_agi / 20.00);
    var desperado_lvl = Math.min(standard_float(attacker_data["desperado_lvl"]), 20.00);
    var desperado_modifier = 5.00 + (desperado_lvl * 0.50) + desperado_agi_modifier;

    var capoeira_lvl = Math.min(standard_float(attacker_data["capoeira_lvl"]), 10.00);
    var capoeira_modifier = 0.30 + (capoeira_lvl * 0.01);

    var s_rune_first_line = Math.min(as_modifier(attacker_data["s_rune_first_line"]), 20.00);
    var s_rune_second_line = Math.min(as_modifier(attacker_data["s_rune_second_line"], 0.10));
    var s_rune_second_line_modifier = stat_agi * s_rune_second_line;
    var rune_modifier = 1.00 + s_rune_first_line + s_rune_second_line_modifier;

    var base_value = standard_float(previous_base_value + refine_atk);
    var total_modifiers = refine_reduction * range_modifier * desperado_modifier * capoeira_modifier * rune_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_previous = standard_float(previous_base_value / base_value);
    var ratio_refine_atk = standard_float(refine_atk / base_value);

    return {
        "refine_reduction": refine_reduction,
        "range_modifier": range_modifier,
        "desperado_modifier": desperado_modifier,
        "capoeira_modifier": capoeira_modifier,
        "rune_modifier": rune_modifier,

        "ratio_previous": ratio_previous,
        "ratio_refine_atk": ratio_refine_atk,

        "previous_base_value": previous_base_value,
        "refine_atk": refine_atk,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function calc_carnage_capoeira_tier3_part2(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var defender_vit_reduction = defender_data["stat_vit"] * 2.00;

    var aesir_rune_lvl = 6.00 - Math.min(standard_float(attacker_data["aesir_rune_lvl"]), 6.00);
    var aesir_modifier = 1.00 + (aesir_rune_lvl * 0.05);
    aesir_modifier = standard_float(aesir_modifier);

    var pistol_type = attacker_data["pistol_type"];
    var refine_weapon = attacker_data["refine_weapon"];
    var pistol_refine_modifier = pistol_type == 0 ? 0.02 : 0.00;
    var pistol_modifier = 1.00 + (pistol_refine_modifier * refine_weapon);

    var base_value = previous_base_value - defender_vit_reduction;
    var total_modifiers = aesir_modifier * pistol_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    return {
        "aesir_modifier": aesir_modifier,
        "pistol_modifier": pistol_modifier,

        "previous_base_value": previous_base_value,
        "defender_vit_reduction": defender_vit_reduction,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    }
}

function calc_carnage_capoeira_tier3(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var tier3_part1 = calc_carnage_capoeira_tier3_part1(previous_base_value_string, attacker_data, defender_data);
    var tier3_part1_total_value = tier3_part1["total_value"];

    var tier3_part2 = calc_carnage_capoeira_tier3_part2(tier3_part1_total_value.toString(), attacker_data, defender_data);
    var total_modifiers = tier3_part1["total_modifiers"] * tier3_part2["total_modifiers"]

    return {
        "refine_reduction": tier3_part1["refine_reduction"],
        "range_modifier": tier3_part1["range_modifier"],
        "desperado_modifier": tier3_part1["desperado_modifier"],
        "capoeira_modifier": tier3_part1["capoeira_modifier"],
        "rune_modifier": tier3_part1["rune_modifier"],

        "aesir_modifier": tier3_part2["aesir_modifier"],
        "pistol_modifier": tier3_part2["pistol_modifier"],

        "ratio_previous": tier3_part1["ratio_previous"],
        "ratio_refine_atk": tier3_part1["ratio_refine_atk"],

        "previous_base_value": previous_base_value,
        "refine_atk": tier3_part1["refine_atk"],
        "base_value": tier3_part1["base_value"],

        "defender_vit_reduction": tier3_part2["defender_vit_reduction"],
        "part1_modifiers": tier3_part1["total_modifiers"],
        "part2_modifiers": tier3_part2["total_modifiers"],
        "total_modifiers": total_modifiers,
        "total_value": tier3_part2["total_value"]
    }
}

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

    var tier3_data = calc_carnage_capoeira_tier3(tier2_value, attacker_data, defender_data);
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
    document.getElementById("display.tier4").textContent = display_generic_tier(tier4_data);

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
