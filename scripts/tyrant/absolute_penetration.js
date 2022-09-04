function calc_absolute_penetration_tier2(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var stat_dex = attacker_data["stat_dex"];
    var stat_str = attacker_data["stat_str"];
    var stat_luk = attacker_data["stat_luk"];
    var stat_atk = (stat_dex * 2 + Math.floor(stat_dex * stat_dex / 100)) + Math.floor(stat_str / 5) + Math.floor(stat_luk / 5);

    var matk = standard_float(attacker_data["matk"]);
    var usable_matk = standard_float(matk * 0.71);

    var race_modifier = calc_pvp_race_modifier(attacker_data["race_incr"], defender_data["race_redu"]);
    var pvp_modifier = calc_generic_modifier(attacker_data["pvp_incr"], defender_data["pvp_redu"]);
    var defense_modifier = calc_pvp_def_modifier(attacker_data["patk"], attacker_data["ignore_def"], 
        defender_data["def_per"], defender_data["def_raw"], defender_data["stat_vit"]);

    var redu_from_skills_array = [];
    if(defender_data["has_energy_coat"]) {
        redu_from_skills_array.push("0.30");
    }
    if(defender_data["has_heart_of_steel"]) {
        redu_from_skills_array.push("0.10");
    }
    if(defender_data["has_selfless_shield"]) {
        redu_from_skills_array.push("0.40");
    }
    if(defender_data["has_vanished"]) {
        redu_from_skills_array.push("0.20");
    }
    if(defender_data["has_epiclesis"]) {
        redu_from_skills_array.push("0.80");
    }
    if(defender_data["has_near_death_awaken"]) {
        redu_from_skills_array.push("0.70");
    }

    var physical_modifier = calc_pvp_physical_modifier(attacker_data["phys_pen"], defender_data["dam_redu"], 
        attacker_data["refine_weapon"], attacker_data["refine_acce1"], attacker_data["refine_acce2"], 
        redu_from_skills_array);

    var base_value = standard_float(previous_base_value + stat_atk + usable_matk);
    var total_modifiers = race_modifier * pvp_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_stat_atk = standard_float(stat_atk / base_value);
    var ratio_matk = standard_float(usable_matk / base_value);
    var ratio_patk = standard_float(previous_base_value / base_value);

    return {
        "race_modifier": race_modifier,
        "pvp_modifier": pvp_modifier,
        "defense_modifier": defense_modifier,
        "physical_modifier": physical_modifier,

        "ratio_patk": ratio_patk,
        "ratio_stat_atk": ratio_stat_atk,
        "ratio_matk": ratio_matk,

        "previous_base_value": previous_base_value,
        "stat_atk": stat_atk,
        "usable_matk": usable_matk,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function calc_absolute_penetration_tier3(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);

    var stat_luk = standard_float(attacker_data["stat_luk"]);
    var luk_passive_lvl = standard_float(attacker_data["luk_passive_lvl"]);
    var luk_bonus = standard_float(luk_passive_lvl * 3.00 * stat_luk);

    var defender_def_per = standard_float(defender_data["def_per"]);
    if(defender_data["under_poison"]) {
        defender_def_per = standard_float(defender_def_per - 25.00);
    }
    if(defender_data["under_petrify"]) {
        defender_def_per = standard_float(defender_def_per - 50.00);
    }

    var defense_modifier = calc_pvp_def_modifier(attacker_data["patk"], attacker_data["ignore_def"], 
        defender_def_per, defender_data["def_raw"], defender_data["stat_vit"]);

    var redu_from_skills_array = collate_redu_from_skills(defender_data);

    var physical_modifier = calc_pvp_physical_modifier(attacker_data["phys_pen"], defender_data["dam_redu"], 
        attacker_data["refine_weapon"], attacker_data["refine_acce1"], attacker_data["refine_acce2"], 
        redu_from_skills_array);

    var base_value = standard_float(previous_base_value + luk_bonus);
    var total_modifiers = defense_modifier * physical_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_previous = standard_float(previous_base_value / base_value);
    var ratio_luk_bonus = standard_float(luk_bonus / base_value);

    return {
        "defense_modifier": defense_modifier,
        "physical_modifier": physical_modifier,

        "ratio_previous": ratio_previous,
        "ratio_luk_bonus": ratio_luk_bonus,

        "previous_base_value": previous_base_value,
        "luk_bonus": luk_bonus,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function calc_absolute_penetration_tier4(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var refine_atk = attacker_data["refine_atk"];

    var refine_reduction = calc_defender_refine_reduction(defender_data);
    var range_redu = "range_redu" in defender_data ? defender_data["range_redu"] : 0.00
    var range_modifier = calc_generic_modifier(attacker_data["pdi"], range_redu);
    
    var crackshot_lvl = standard_float(attacker_data["crackshot_lvl"]);
    var crackshot_modifier = standard_float((crackshot_lvl * 0.60) + 12.00);

    var absolute_penetration_lvl = standard_float(attacker_data["absolute_penetration_lvl"]);
    var absolute_penetration_modifier = standard_float(1.00 + (absolute_penetration_lvl * 0.03));

    var assault_terminator_modifier = standard_float(1.00 + (attacker_data["refine_weapon"] * 0.02));

    var aesir_nodes_option = standard_float(attacker_data["aesir_nodes"]);
    var aesir_nodes = standard_float(7.00 - Math.min(aesir_nodes_option, 7.00));
    var aesir_modifier = standard_float(1.00 + (aesir_nodes * 0.05));

    var absolute_penetration_modifier_part1 = crackshot_modifier * absolute_penetration_modifier * assault_terminator_modifier * aesir_modifier * refine_reduction * range_modifier;
    absolute_penetration_modifier_part1 = standard_float(absolute_penetration_modifier_part1);

    var distance_metres = standard_float(attacker_data["distance_metres"]);
    var distance_modifier = standard_float(1.00 + (distance_metres * 0.07));

    var charging_time = standard_float(parseInt(attacker_data["charging_time"]));
    var charging_modifier = standard_float(1.00 + (charging_time * 0.50));

    var absolute_penetration_modifier_part2 = distance_modifier * charging_modifier;
    absolute_penetration_modifier_part2 = standard_float(absolute_penetration_modifier_part2);

    var defender_def_raw = standard_float(defender_data["def_raw"]);
    var defender_def_per = as_modifier(defender_data["def_per"]);
    var defender_def_total = standard_float(defender_def_raw * (1.00 + defender_def_per));
    var defense_bonus = standard_float(defender_def_total / 500.00);

    var defender_vit = standard_float(defender_data["stat_vit"]);
    var defender_vit_reduction = standard_float(defender_vit * 2);

    var base_value = standard_float(previous_base_value + refine_atk);
    var total_value = (base_value * (absolute_penetration_modifier_part1 + defense_bonus));
    total_value = total_value * absolute_penetration_modifier_part2;
    total_value = total_value - defender_vit_reduction;
    total_value = standard_float(total_value);

    var ratio_previous = standard_float(previous_base_value / base_value);
    var ratio_refine_atk = standard_float(refine_atk / base_value);

    return {
        "refine_reduction": refine_reduction,
        "range_modifier": range_modifier,
        "assault_terminator_modifier": assault_terminator_modifier,
        "absolute_penetration_modifier_part1": absolute_penetration_modifier_part1,
        "defense_bonus": defense_bonus,
        "absolute_penetration_modifier_part2": absolute_penetration_modifier_part2,
        "defender_vit_reduction": defender_vit_reduction,

        "ratio_previous": ratio_previous,
        "ratio_refine_atk": ratio_refine_atk,

        "previous_base_value": previous_base_value,
        "refine_atk": refine_atk,
        "base_value": base_value,
        "total_value": total_value
    };
}

function display_tier4(tier4_data) {
    var base_value = tier4_data["base_value"];
    var part1_modifiers = tier4_data["absolute_penetration_modifier_part1"];
    var part2_modifiers = tier4_data["absolute_penetration_modifier_part2"];
    var defense_bonus = tier4_data["defense_bonus"];
    var full_part1_modifiers = part1_modifiers + defense_bonus;
    var vit_reduction = tier4_data["defender_vit_reduction"];
    var total_value = tier4_data["total_value"];

    return `(base=${base_value} * (part1_modifiers=${part1_modifiers} + defense_bonus=${defense_bonus})=${full_part1_modifiers} * part2_modifiers=${part2_modifiers}) - vit_reduction=${vit_reduction} = ${total_value}`;
}

function update_all() {
    var with_prefix = false;
    var attacker_data = retrieve_all_elements_by_class("attacker", with_prefix);
    var defender_data = retrieve_all_elements_by_class("defender", with_prefix);

    attacker_data["forced_element"] = "neutral";

    var tier1_data = calc_standard_physical_tier1(attacker_data, defender_data);
    update_as_computed(tier1_data);
    var tier1_value = tier1_data["total_value"];
    document.getElementById("display.tier1").textContent = display_generic_tier(tier1_data);
    
    var tier2_data = calc_absolute_penetration_tier2(tier1_value, attacker_data, defender_data);
    update_as_computed(tier2_data);
    var tier2_value = tier2_data["total_value"];
    document.getElementById("display.tier2").textContent = display_generic_tier(tier2_data);

    var damage_ratios = ratio_entries(tier2_data);

    var tier3_data = calc_absolute_penetration_tier3(tier2_value, attacker_data, defender_data);
    update_as_computed(tier3_data);
    var tier3_value = tier3_data["total_value"];
    document.getElementById("display.tier3").textContent = display_generic_tier(tier3_data);

    damage_ratios["ratio_previous"] = tier3_data["ratio_previous"];
    damage_ratios = ratio_entries(damage_ratios);
    damage_ratios["ratio_luk_bonus"] = tier3_data["ratio_luk_bonus"];

    var tier4_data = calc_absolute_penetration_tier4(tier3_value, attacker_data, defender_data);
    update_as_computed(tier4_data);
    var tier4_value = tier4_data["total_value"];
    document.getElementById("display.tier4").textContent = display_tier4(tier4_data);

    damage_ratios["ratio_previous"] = tier4_data["ratio_previous"];
    damage_ratios = ratio_entries(damage_ratios);
    damage_ratios["ratio_refine_atk"] = tier4_data["ratio_refine_atk"];

    var tier5_data = calc_standard_skill_tier4(tier4_value, attacker_data, defender_data);
    update_as_computed(tier5_data);
    var tier5_value = tier5_data["total_value"];
    var final_value = parseInt(tier5_value);
    document.getElementById("display.tier5").textContent = display_generic_final_tier(tier5_data);

    damage_ratios["ratio_previous"] = tier5_data["ratio_previous"];
    damage_ratios = ratio_entries(damage_ratios);
    damage_ratios["ratio_true_dmg"] = tier5_data["ratio_true_dmg"];

    document.getElementById("display.status_dmg_modifier").textContent = "(" + tier5_data["status_dmg_type"] + ") " + tier5_data["status_dmg_modifier"];

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
