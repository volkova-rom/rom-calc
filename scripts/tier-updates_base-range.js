function gi(id_string) {
    return document.getElementById(id_string)
}

function giv(id_string) {
    return document.getElementById(id_string).value
}

function gitc(id_string) {
    return document.getElementById(id_string).textContent
}

function gitc_float(id_string) {
    return parseFloat(document.getElementById(id_string).textContent)
}

function is_checked(id_string) {
    return gi(id_string).checked
}

function on_checked_return(id_string, return_value) {
    return gi(id_string).checked ? return_value : 0.00
}

function update_span_class(class_name, new_value) {
    spans_of_class = document.getElementsByClassName(class_name)

    for (current_span of spans_of_class) {
        current_span.textContent = new_value
    }
}

function coalesce_array(array_of_floats) {
    total_float = 0.00
    for (array_item of array_of_floats) {
        float_item = parseFloat(array_item)
        total_float = total_float + float_item
    }

    return total_float
}

function base_update_tier1() {
    patk = parseFloat(giv("i_patk"))
    weap_penalty = parseFloat(giv("i_weap-penalty"))
    size_mod = calc_modifier(giv("i_size-inc"), giv("i_size-dec"))

    element_table = get_element_table()
    source_element_table = get_or_default(element_table, giv("i_attacker-elem"), {})
    elem_rate = get_or_default(source_element_table, giv("i_defender-elem"), 1.00)

    if (is_checked("i_has-snowy-owl") && elem_rate > 1.00) {
        elem_rate = elem_rate * 1.10
    }
    if (is_checked("i_has-divine-carver")) {
        elem_rate = Math.min(elem_rate, 1.00)
    }
    if (is_checked("i_has-lov")) {
        elem_rate = elem_rate + 0.15
    }

    elem_inc = 1 + as_mod(giv("i_elem-inc"))
    elem_mod = calc_elem_modifier(giv("i_elem-atk"), giv("i_elem-def"))

    tier1_mod =  weap_penalty * size_mod * elem_rate * elem_inc * elem_mod
    tier1_mod = three_decimals(tier1_mod)
    tier1 = three_decimals(patk * tier1_mod)

    update_span_class("dup_patk", patk)
    gi("comp_weap-penalty").textContent = weap_penalty
    gi("comp_size-mod").textContent = size_mod
    gi("comp_elem-rate").textContent = elem_rate
    gi("comp_elem-inc").textContent = elem_inc
    gi("comp_elem-mod").textContent = elem_mod

    gi("comp_tier1").textContent = tier1
    gi("display_tier1").textContent = "patk=" + patk.toString() + " x tier1_total_modifiers=" + tier1_mod.toString() + " = " + tier1.toString()
}

function base_update_tier2() {
    update_tier1()

    tier1 = parseFloat(gi("comp_tier1").textContent)
    dex = parseInt(giv("i_attacker-dex"))
    str = parseInt(giv("i_attacker-str"))
    luk = parseInt(giv("i_attacker-luk"))

    stat_atk = (dex * 2 + Math.floor(dex * dex / 100)) + Math.floor(str / 5) + Math.floor(luk / 5)
    race_mod = three_decimals(calc_race_modifier(giv("i_race-inc"), giv("i_race-dec")))
    pvp_mod = three_decimals(Math.max(calc_modifier(giv("i_pvp-inc"), giv("i_pvp-dec")), 0.10))

    defender_vit = parseInt(giv("i_defender-vit"))
    def_mod = calc_def_modifier(giv("i_patk"), giv("i_ig-def"), giv("i_defender-def-per"), giv("i_defender-raw-def"), defender_vit)
    def_mod = three_decimals(def_mod)

    reducts_from_skill = []
    if (is_checked("i_has-energy-coat")) {
        reducts_from_skill.push("0.30")
    }
    if (is_checked("i_has-heart-of-steel")) {
        reducts_from_skill.push("0.10")
    }
    if (is_checked("i_has-selfless-shield")) {
        reducts_from_skill.push("0.40")
    }
    if (is_checked("i_has-vanished")) {
        reducts_from_skill.push("0.20")
    }
    if (is_checked("i_has-epiclesis")) {
        reducts_from_skill.push("0.80")
    }
    if (is_checked("i_has-near-death-awaken")) {
        reducts_from_skill.push("0.70")
    }

    phys_mod = calc_phys_modifier(giv("i_phys-pen"), giv("i_dam-reduc"), giv("i_weapon-refine"), giv("i_acce1-refine"), giv("i_acce2-refine"), reducts_from_skill)
    phys_mod = three_decimals(phys_mod)
    tier2_mod = race_mod * pvp_mod * def_mod * phys_mod
    tier2_mod = three_decimals(tier2_mod)
    tier2_base = three_decimals(tier1 + stat_atk)
    tier2 = tier2_base * tier2_mod
    tier2 = three_decimals(tier2)

    gi("ratio_patk").textContent = three_decimals(tier1 / tier2_base)
    gi("ratio_stat-atk").textContent = three_decimals(stat_atk / tier2_base)

    gi("comp_attacker-stats").textContent = stat_atk
    gi("comp_race-mod").textContent = race_mod
    gi("comp_pvp-mod").textContent = pvp_mod
    gi("comp_def-mod").textContent = def_mod
    update_span_class("dup_defender-vit", defender_vit)
    gi("comp_phys-mod").textContent = phys_mod
    gi("comp_tier2").textContent = tier2
    gi("display_tier2").textContent = "(tier1=" + tier1.toString() + " + stat_atk=" + stat_atk.toString() + ")=" + 
        tier2_base.toString() + " x tier2_total_modifiers=" + tier2_mod.toString() + " = " + tier2.toString()
}

function base_refine_reduct() {
    offhand_refine = parseFloat(giv("i_defender_offhand-refine"))
    armor_refine = parseFloat(giv("i_defender_armor-refine"))
    garment_refine = parseFloat(giv("i_defender_garment-refine"))
    shoes_refine = parseFloat(giv("i_defender_shoes-refine"))

    total_refine = offhand_refine + armor_refine + garment_refine + shoes_refine

    return three_decimals(1.00 - (total_refine * 0.009))
}

function base_update_tier3() {
    update_tier2()
    tier2 = parseFloat(gi("comp_tier2").textContent)

    refine_atk = parseInt(giv("i_refine-atk"))
    refine_reduct = base_refine_reduct()
    range_mod = calc_modifier(giv("i_pdi"), giv("i_range-reduct"))
    skill_mod_per = parseFloat(giv("i_skill-mod-per")) / 100
    enemy_vit = parseInt(giv("i_defender-vit"))
    vit_reduct = enemy_vit * 2

    tier3_base = three_decimals(tier2 + refine_atk)
    tier3_mod = refine_reduct * range_mod * skill_mod_per
    tier3 = three_decimals(tier3_base * tier3_mod)
    tier3 = three_decimals(tier3 - vit_reduct)

    prev_tier_ratio = three_decimals(tier2 / tier3_base)
    gi("ratio_refine-atk").textContent = three_decimals(refine_atk / tier3_base)
    gi("ratio_patk").textContent = three_decimals(gitc_float("ratio_patk") * prev_tier_ratio)
    gi("ratio_stat-atk").textContent = three_decimals(gitc_float("ratio_stat-atk") * prev_tier_ratio)

    update_span_class("dup_refine-atk", refine_atk)
    update_span_class("dup_defender-vit", defender_vit)
    gi("comp_range-mod").textContent = range_mod
    gi("comp_skill-mod-per").textContent = skill_mod_per
    gi("comp_refine-reduct").textContent = refine_reduct
    gi("comp_tier3").textContent = tier3
    gi("display_tier3").textContent = "((tier2=" + tier2.toString() + " + refine_atk=" + refine_atk.toString() + ")=" + tier3_base.toString() + 
        " x tier3_total_modifiers=" + tier3_mod.toString() +
        ") - vit_reduct=" + vit_reduct.toString() + " = " + tier3.toString()
}

function calc_final_dmg() {
    final_dmg_array = []

    is_lod_active = is_checked("i_under-poison") || is_checked("i_under-bleed") ||
        is_checked("i_under-stun") || is_checked("i_under-curse")
    is_chimera_active = is_checked("i_under-poison")

    final_dmg_array.push(is_lod_active ? giv("i_lod-count") : 0.00)
    final_dmg_array.push(on_checked_return("i_has-lod-depo", is_lod_active ? 0.05 : 0.00))
    final_dmg_array.push(on_checked_return("i_has-chimera-star", is_chimera_active ? 0.20 : 0.00))
    final_dmg_array.push(on_checked_return("i_has-chimera-star-depo", is_chimera_active ? 0.05 : 0.00))
    final_dmg_array.push(on_checked_return("i_has-glut-imp", 0.05))

    remaining_hp_er = parseFloat(giv("i_remaining-hp-per")) / 100
    final_dmg_array.push(on_checked_return("i_has-cyborg-bunny", (1.00 - remaining_hp_er)/10.00))

    final_dmg_array.push(on_checked_return("i_has-love-goddess", 0.10))
    final_dmg_array.push(on_checked_return("i_has-wind-perch-drake", 0.05))

    master_tackler_lvl = parseFloat(giv("i_master-tackler-lvl"))
    chess_or_orb = giv("i_chess-orb")
    if (chess_or_orb == "chess") {
        final_dmg_array.push(master_tackler_lvl * 0.04)
    }
    if (chess_or_orb == "orb") {
        final_dmg_array.push(master_tackler_lvl * 0.07)
    }

    stat_afflicted_count = parseFloat(giv("i_status-afflicted-count"))
    final_dmg_array.push(on_checked_return("i_has-ore-spirit", 0.05 * stat_afflicted_count))
    final_dmg_array.push(on_checked_return("i_has-chaotic-blade", 0.08 * stat_afflicted_count))

    final_dmg_array.push(giv("i_war-ender-artifact"))
    final_dmg_array.push(giv("i_mysteltainn-artifact"))

    total_final_dmg = 1.00
    for (current_final_dmg of final_dmg_array) {
        current_final_dmg_float = parseFloat(current_final_dmg)
        if (current_final_dmg_float <= 0) {
            continue;
        }
        total_final_dmg = total_final_dmg + current_final_dmg_float
    }
    return three_decimals(total_final_dmg)
}

function status_dict(status_name, modifier_value) {
    return {
        "status": status_name,
        "mod_value": modifier_value
    }
}

function calc_status_dmg() {
    if (is_checked("i_under-poison")) {    
        poison_dmg_array = []
        poison_dmg_array.push(on_checked_return("i_has-poison-tail", 0.10))
        total_poison_dmg = coalesce_array(poison_dmg_array)
        if (total_poison_dmg > 0) {
            return status_dict("poison", total_poison_dmg)
        }
    }

    if (is_checked("i_under-stun")) {
        stun_dmg_array = []
        stun_dmg_array.push(on_checked_return("i_has-orc-hero-depo-combo", 0.15))
        stun_dmg_array.push(on_checked_return("i_has-thunder-kabuto", 0.10))
        stun_dmg_array.push(giv("i_rotar-zairo-star-count"))
        total_stun_dmg = coalesce_array(stun_dmg_array)
        if (total_stun_dmg > 0) {
            return status_dict("stun", total_stun_dmg)
        }
    }

    if (is_checked("i_under-freeze")) {
        freeze_dmg_array = []
        freeze_dmg_array.push(on_checked_return("i_has-marina-depo-combo", 0.25))
        freeze_dmg_array.push(on_checked_return("i_has-garm-depo-combo", 0.25))
        freeze_dmg_array.push(on_checked_return("i_has-stormy-knight-combo", 0.25))
        total_freeze_dmg = coalesce_array(freeze_dmg_array)
        if (total_freeze_dmg > 0) {
            return status_dict("freeze", total_freeze_dmg)
        }
    }
    
    if (is_checked("i_under-bleed")) {
        bleed_dmg_array = []
        bleed_dmg_array.push(on_checked_return("i_has-moonlight-swing", 0.05))
        total_bleed_dmg = coalesce_array(bleed_dmg_array)
        if (total_bleed_dmg > 0) {
            return status_dict("bleed", total_bleed_dmg)
        }
    }

    if (is_checked("i_under-fear")) {
        fear_dmg_array = []
        fear_dmg_array.push(on_checked_return("i_cursed-hand_acce1", parseFloat(giv("i_acce1-refine") * 0.01)))
        fear_dmg_array.push(on_checked_return("i_cursed-hand_acce2", parseFloat(giv("i_acce2-refine") * 0.01)))
        total_fear_dmg = coalesce_array(fear_dmg_array)
        if (total_fear_dmg > 0) {
            return status_dict("fear", total_fear_dmg)
        }
    }

    if (is_checked("i_under-curse")) {
        curse_dmg_array = []
        curse_dmg_array.push(on_checked_return("i_cursed-hand_acce1", parseFloat(giv("i_acce1-refine") * 0.01)))
        curse_dmg_array.push(on_checked_return("i_cursed-hand_acce2", parseFloat(giv("i_acce2-refine") * 0.01)))
        total_curse_dmg = coalesce_array(curse_dmg_array)
        if (total_curse_dmg > 0) {
            return status_dict("curse", total_curse_dmg)
        }
    }

    if (is_checked("i_under-silence")) {
        silence_dmg_array = []
        silence_dmg_array.push(on_checked_return("i_cursed-hand_acce1", parseFloat(giv("i_acce1-refine") * 0.01)))
        silence_dmg_array.push(on_checked_return("i_cursed-hand_acce2", parseFloat(giv("i_acce2-refine") * 0.01)))
        total_silence_dmg = coalesce_array(silence_dmg_array)
        if (total_silence_dmg > 0) {
            return status_dict("silence", total_silence_dmg)
        }
    }

    if (is_checked("i_under-darkness")) {
        darkness_dmg_array = []
        darkness_dmg_array.push(on_checked_return("i_cursed-hand_acce1", parseFloat(giv("i_acce1-refine") * 0.01)))
        darkness_dmg_array.push(on_checked_return("i_cursed-hand_acce2", parseFloat(giv("i_acce2-refine") * 0.01)))
        total_darkness_dmg = coalesce_array(darkness_dmg_array)
        if (total_darkness_dmg) {
            return status_dict("darkness", total_darkness_dmg)
        }
    }

    return status_dict("none", 0.00)
}

function base_update_tier4() {
    update_tier3()
    tier3 = parseFloat(gi("comp_tier3").textContent)

    patk = parseFloat(giv("i_patk"))
    matk = parseFloat(giv("i_matk"))
    monocular_refine_mod = parseFloat(giv("i_monocular-refine"))

    monocular_true_dmg = (patk + matk) * monocular_refine_mod

    guild_prayer_true_dmg_lvl = Math.min(parseInt(giv("i_guild-prayer_true-skill")), 10)
    guild_prayer_true_dmg = 150 * guild_prayer_true_dmg_lvl

    comp_true_dmg = monocular_true_dmg + guild_prayer_true_dmg

    tier4_base = three_decimals(tier3 + comp_true_dmg)

    skill_dmg_mod = calc_modifier(giv("i_skill-dmg-inc"), giv("i_skill-dmg-reduct"))

    final_dmg_mod = calc_final_dmg()

    status_dictionary = calc_status_dmg()
    status_name = status_dictionary.status
    status_dmg_mod = three_decimals(1 + status_dictionary.mod_value)

    tier4_mod = skill_dmg_mod * final_dmg_mod * status_dmg_mod
    tier4 = tier4_base * tier4_mod
    tier4 = three_decimals(tier4)

    prev_tier_ratio = three_decimals(tier3 / tier4_base)
    gi("ratio_true-dmg").textContent = three_decimals(comp_true_dmg / tier4_base * 100)
    gi("ratio_patk").textContent = three_decimals(gitc_float("ratio_patk") * prev_tier_ratio * 100)
    gi("ratio_stat-atk").textContent = three_decimals(gitc_float("ratio_stat-atk") * prev_tier_ratio * 100)
    gi("ratio_refine-atk").textContent = three_decimals(gitc_float("ratio_refine-atk") * prev_tier_ratio * 100)

    gi("comp_true-dmg").textContent = comp_true_dmg
    gi("comp_skill-dmg-mod").textContent = skill_dmg_mod
    gi("comp_final-dmg-mod").textContent = final_dmg_mod
    gi("comp_status-dmg-mod").textContent = status_dmg_mod
    update_span_class("dup_status-dmg-mod", "(" + status_name + ") " + status_dmg_mod.toString())
    gi("comp_tier4").textContent = tier4

    update_span_class("dup_tier4", parseInt(tier4).toLocaleString("en-US"))
    gi("display_tier4").textContent = "(tier3=" + tier3.toString() + " + true_dmg=" + comp_true_dmg.toString() + 
        ") x tier4_total_modifiers=" + tier4_mod.toString() + " = " + tier4.toString()
}

function update_all() {
    update_tier4()
}