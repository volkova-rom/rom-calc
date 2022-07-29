function update_tier1() {
    base_update_tier1()
}

function update_tier2() {
    base_update_tier2()
}

function update_tier3() {
    update_tier2()
    tier2 = parseFloat(gi("comp_tier2").textContent)

    refine_atk = parseInt(giv("i_refine-atk"))
    refine_reduct = base_refine_reduct()
    range_mod = calc_modifier(giv("i_pdi"), giv("i_range-reduct"))

    agi = parseFloat(giv("i_attacker-agi"))
    agi_boost = three_decimals(agi / 20.00)

    desperado_mod = (0.50 * parseFloat(giv("i_desperado-lvl"))) + 5 + agi_boost

    capoeira_mod = (0.01 * parseFloat(giv("i_capoeira-lvl"))) + 0.3

    s_rune_first_line_mod = three_decimals(as_mod(giv("i_s-rune_first-line")))
    s_rune_second_line = three_decimals(as_mod(giv("i_s-rune_second-line")))
    s_rune_second_line_mod = s_rune_second_line * agi
    s_rune_mod = 1.00 + s_rune_first_line_mod + s_rune_second_line_mod

    capo_skill_mod = three_decimals(desperado_mod * capoeira_mod * s_rune_mod)
    aesir_mod = three_decimals(1 + parseFloat(giv("i_aesir-mod")))

    pistol_mod_per_refine = parseFloat(giv("i_pistol"))
    pistol_mod = three_decimals(1 + pistol_mod_per_refine * parseFloat(giv("i_weapon-refine")))
    enemy_vit = parseInt(giv("i_defender-vit"))
    vit_reduct = enemy_vit * 2

    tier3_base = three_decimals(tier2 + refine_atk)
    tier3_parta_mod = three_decimals(refine_reduct * range_mod * capo_skill_mod)
    tier3 = three_decimals(tier3_base * tier3_parta_mod)
    tier3 = three_decimals(tier3 - vit_reduct)
    tier3_partb_mod = three_decimals(aesir_mod * pistol_mod)
    tier3 = three_decimals(tier3 * tier3_partb_mod)

    prev_tier_ratio = three_decimals(tier2 / tier3_base)
    gi("ratio_refine-atk").textContent = three_decimals(refine_atk / tier3_base)
    gi("ratio_patk").textContent = three_decimals(gitc_float("ratio_patk") * prev_tier_ratio)
    gi("ratio_stat-atk").textContent = three_decimals(gitc_float("ratio_stat-atk") * prev_tier_ratio)

    update_span_class("dup_refine-atk", refine_atk)
    update_span_class("dup_defender-vit", defender_vit)
    gi("comp_range-mod").textContent = range_mod
    gi("comp_capo-skill-mod").textContent = capo_skill_mod
    gi("comp_aesir-mod").textContent = aesir_mod
    gi("comp_pistol-mod").textContent = pistol_mod
    gi("comp_refine-reduct").textContent = refine_reduct
    gi("comp_tier3").textContent = tier3
    gi("display_tier3").textContent = "(((tier2=" + tier2.toString() + " + refine_atk=" + refine_atk.toString() + ")=" + tier3_base.toString() + 
        " x tier3_part-A_modifiers=" + tier3_parta_mod.toString() +
        ") - vit_reduct=" + vit_reduct.toString() + ") x tier3_part-B_modifiers=" + tier3_partb_mod.toString() + " = " + tier3.toString()
}

function update_tier4() {
    base_update_tier4()
}