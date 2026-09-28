// ============================================================
// FC27 META SCORE ENGINE
// Position-specific • Gameplay-focused • GK-aware
// ============================================================

/*
  META SCORE PHILOSOPHY

  The score is NOT simply based on overall rating.

  Different positions value different attributes:

  ST / CF
  → Shooting, Pace, Dribbling, Physical, Passing

  LW / RW / LM / RM
  → Pace, Dribbling, Shooting, Passing, Physical

  CAM
  → Passing, Dribbling, Shooting, Pace, Physical

  CM
  → Passing, Dribbling, Defending, Physical, Pace, Shooting

  CDM
  → Defending, Passing, Physical, Dribbling, Pace

  LB / RB / LWB / RWB
  → Pace, Defending, Passing, Dribbling, Physical

  CB
  → Defending, Physical, Pace, Dribbling, Passing

  GK
  → Uses GK-specific weighting
     PAC  = DIV
     SHO  = HAN
     PAS  = KIC
     DRI  = REF
     DEF  = SPD
     PHY  = POS
*/

// ============================================================
// HELPERS
// ============================================================

const clamp = (value, min = 0, max = 100) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.max(min, Math.min(max, number));
};

const weightedAverage = (stats, weights) => {
  let total = 0;
  let weightTotal = 0;

  Object.entries(weights).forEach(([stat, weight]) => {
    const value = clamp(stats[stat]);

    total += value * weight;
    weightTotal += weight;
  });

  if (!weightTotal) {
    return 0;
  }

  return total / weightTotal;
};

// ============================================================
// POSITION GROUPS
// ============================================================

const ATTACKERS = [
  "ST",
  "CF"
];

const WIDE_ATTACKERS = [
  "LW",
  "RW",
  "LM",
  "RM"
];

const ATTACKING_MIDS = [
  "CAM"
];

const CENTRAL_MIDS = [
  "CM"
];

const DEFENSIVE_MIDS = [
  "CDM"
];

const FULLBACKS = [
  "LB",
  "RB",
  "LWB",
  "RWB"
];

const DEFENDERS = [
  "CB"
];

// ============================================================
// GK SCORE
// ============================================================

/*
  IMPORTANT:

  Your playerData model maps goalkeeper attributes like this:

  pace     = DIV
  shooting = HAN
  passing  = KIC
  dribbling = REF
  defending = SPD
  physical  = POS

  So we DO NOT use the normal outfield formulas for GK.

  Reflexes + Diving are the biggest factors.
  Positioning + Handling are also extremely important.
  Kicking matters, but shouldn't dominate the score.
*/

const calculateGKScore = (player) => {
  const diving = clamp(player.pace);
  const handling = clamp(player.shooting);
  const kicking = clamp(player.passing);
  const reflexes = clamp(player.dribbling);
  const speed = clamp(player.defending);
  const positioning = clamp(player.physical);

  const baseScore =
    diving * 0.28 +
    reflexes * 0.28 +
    positioning * 0.19 +
    handling * 0.17 +
    kicking * 0.08;

  /*
    Small speed adjustment.

    Speed matters for modern keepers,
    but it should NEVER overpower actual GK ability.
  */

  const speedBonus =
    speed >= 70
      ? 2
      : speed >= 60
        ? 1
        : speed <= 40
          ? -1
          : 0;

  return clamp(baseScore + speedBonus);
};

// ============================================================
// ST / CF
// ============================================================

const calculateStrikerScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    shooting: 0.32,
    pace: 0.24,
    dribbling: 0.20,
    physical: 0.14,
    passing: 0.10
  });
};

// ============================================================
// LW / RW / LM / RM
// ============================================================

const calculateWideScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    dribbling: 0.28,
    pace: 0.26,
    shooting: 0.20,
    passing: 0.16,
    physical: 0.10
  });
};

// ============================================================
// CAM
// ============================================================

const calculateCAMScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    passing: 0.28,
    dribbling: 0.27,
    shooting: 0.19,
    pace: 0.14,
    physical: 0.07,
    defending: 0.05
  });
};

// ============================================================
// CM
// ============================================================

const calculateCMScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    passing: 0.25,
    dribbling: 0.21,
    defending: 0.18,
    physical: 0.15,
    pace: 0.12,
    shooting: 0.09
  });
};

// ============================================================
// CDM
// ============================================================

const calculateCDMScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    defending: 0.31,
    passing: 0.25,
    physical: 0.19,
    dribbling: 0.12,
    pace: 0.09,
    shooting: 0.04
  });
};

// ============================================================
// FULLBACKS
// ============================================================

const calculateFullbackScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    defending: 0.27,
    pace: 0.25,
    passing: 0.18,
    dribbling: 0.16,
    physical: 0.10,
    shooting: 0.04
  });
};

// ============================================================
// CB
// ============================================================

const calculateCBScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    defending: 0.40,
    physical: 0.25,
    pace: 0.18,
    dribbling: 0.08,
    passing: 0.07,
    shooting: 0.02
  });
};

// ============================================================
// GENERIC FALLBACK
// ============================================================

const calculateGenericScore = (player) => {
  const stats = {
    pace: player.pace,
    shooting: player.shooting,
    passing: player.passing,
    dribbling: player.dribbling,
    defending: player.defending,
    physical: player.physical
  };

  return weightedAverage(stats, {
    pace: 0.17,
    shooting: 0.17,
    passing: 0.17,
    dribbling: 0.17,
    defending: 0.16,
    physical: 0.16
  });
};

// ============================================================
// POSITION SCORE SELECTOR
// ============================================================

const getPositionScore = (player) => {
  const position = String(player.position || "").toUpperCase();

  if (position === "GK") {
    return calculateGKScore(player);
  }

  if (ATTACKERS.includes(position)) {
    return calculateStrikerScore(player);
  }

  if (WIDE_ATTACKERS.includes(position)) {
    return calculateWideScore(player);
  }

  if (ATTACKING_MIDS.includes(position)) {
    return calculateCAMScore(player);
  }

  if (CENTRAL_MIDS.includes(position)) {
    return calculateCMScore(player);
  }

  if (DEFENSIVE_MIDS.includes(position)) {
    return calculateCDMScore(player);
  }

  if (FULLBACKS.includes(position)) {
    return calculateFullbackScore(player);
  }

  if (DEFENDERS.includes(position)) {
    return calculateCBScore(player);
  }

  return calculateGenericScore(player);
};

// ============================================================
// GAMEPLAY MODIFIERS
// ============================================================

/*
  These modifiers are intentionally SMALL.

  The six face stats remain the main part of the score.

  We don't want:
  5★ skills = automatically broken
  5★ weak foot = automatically broken

  Instead, these characteristics provide a small advantage.
*/

const getSkillMoveBonus = (player) => {
  const skills = Number(player.skillMoves);

  if (skills >= 5) return 1.5;
  if (skills === 4) return 0.8;
  if (skills === 3) return 0.2;

  return 0;
};

const getWeakFootBonus = (player) => {
  const weakFoot = Number(player.weakFoot);

  if (weakFoot >= 5) return 1.5;
  if (weakFoot === 4) return 0.8;
  if (weakFoot === 3) return 0.2;

  return -0.4;
};

const getWorkRateBonus = (player) => {
  const attacking = String(
    player.attackingWorkRate || ""
  ).toLowerCase();

  const defending = String(
    player.defensiveWorkRate || ""
  ).toLowerCase();

  let bonus = 0;

  if (attacking === "high") {
    bonus += 0.3;
  }

  if (defending === "high") {
    bonus += 0.3;
  }

  return bonus;
};

// ============================================================
// POSITION-SPECIFIC GAMEPLAY BONUS
// ============================================================

const getGameplayBonus = (player) => {
  const position = String(player.position || "").toUpperCase();

  let bonus = 0;

  bonus += getSkillMoveBonus(player);
  bonus += getWeakFootBonus(player);
  bonus += getWorkRateBonus(player);

  /*
    Attackers benefit slightly more from skills/WF.
  */

  if (
    ATTACKERS.includes(position) ||
    WIDE_ATTACKERS.includes(position) ||
    ATTACKING_MIDS.includes(position)
  ) {
    bonus *= 1.15;
  }

  /*
    Defenders get a smaller technical bonus.
  */

  if (
    DEFENDERS.includes(position) ||
    FULLBACKS.includes(position)
  ) {
    bonus *= 0.80;
  }

  /*
    GK does not get skill-move / weak-foot treatment.
    Their score should remain goalkeeper-focused.
  */

  if (position === "GK") {
    bonus = 0;
  }

  return clamp(bonus, -2, 3);
};

// ============================================================
// HEIGHT / PHYSICAL CONTEXT
// ============================================================

const getContextBonus = (player) => {
  const position = String(player.position || "").toUpperCase();
  const height = Number(player.height);

  if (!Number.isFinite(height) || height <= 0) {
    return 0;
  }

  /*
    GK:

    Height matters more here because goalkeeper reach
    is an important gameplay factor.

    But keep the bonus controlled.
  */

  if (position === "GK") {
    if (height >= 195) return 1.5;
    if (height >= 190) return 0.8;
    if (height >= 185) return 0.3;
    if (height < 180) return -1;

    return 0;
  }

  /*
    CB:

    Centre-backs benefit from size,
    but pace/DEF/PHY remain much more important.
  */

  if (position === "CB") {
    if (height >= 195) return 0.8;
    if (height >= 190) return 0.5;
    if (height < 180) return -0.7;

    return 0;
  }

  /*
    Smaller attacking players shouldn't automatically
    get punished for being short.
  */

  return 0;
};

// ============================================================
// FINAL META SCORE
// ============================================================

export const calculateMetaScore = (player) => {
  if (!player) {
    return 0;
  }

  const baseScore = getPositionScore(player);

  const gameplayBonus = getGameplayBonus(player);

  const contextBonus = getContextBonus(player);

  /*
    Base score remains dominant.

    This prevents modifiers from completely changing
    a player's identity.
  */

  let finalScore =
    baseScore +
    gameplayBonus +
    contextBonus;

  /*
    Slight OVR anchoring.

    This stops bizarre results where a low-rated card
    receives an extremely high META score from one
    standout attribute.

    It is intentionally small.
  */

  const overall = Number(player.overall);

  if (Number.isFinite(overall) && overall > 0) {
    const overallAnchor =
      overall * 0.08;

    finalScore =
      finalScore * 0.92 +
      overallAnchor;
  }

  /*
    FINAL SAFETY CLAMP
  */

  return Math.round(
    clamp(finalScore, 0, 100)
  );
};

// ============================================================
// TIER SYSTEM
// ============================================================

export const getTier = (score) => {
  const value = Number(score);

  if (value >= 90) {
    return "S";
  }

  if (value >= 80) {
    return "A";
  }

  if (value >= 70) {
    return "B";
  }

  if (value >= 60) {
    return "C";
  }

  return "D";
};

// ============================================================
// TIER INFORMATION
// ============================================================

export const getTierInfo = (score) => {
  const tier = getTier(score);

  const tiers = {
    S: {
      tier: "S",
      label: "Elite META",
      description:
        "Exceptional for the position and highly effective in-game."
    },

    A: {
      tier: "A",
      label: "Excellent META",
      description:
        "Very strong for the position with excellent gameplay attributes."
    },

    B: {
      tier: "B",
      label: "Strong META",
      description:
        "A solid and reliable option for the position."
    },

    C: {
      tier: "C",
      label: "Usable META",
      description:
        "Usable, but has noticeable limitations for the position."
    },

    D: {
      tier: "D",
      label: "Limited META",
      description:
        "Has significant weaknesses for the position."
    }
  };

  return tiers[tier];
};

// ============================================================
// POSITION LABEL
// ============================================================

export const getPositionLabel = (position) => {
  const labels = {
    GK: "Goalkeeper",

    CB: "Centre Back",

    LB: "Left Back",
    RB: "Right Back",
    LWB: "Left Wing Back",
    RWB: "Right Wing Back",

    CDM: "Defensive Midfielder",
    CM: "Central Midfielder",
    CAM: "Attacking Midfielder",

    LM: "Left Midfielder",
    RM: "Right Midfielder",

    LW: "Left Winger",
    RW: "Right Winger",

    CF: "Centre Forward",
    ST: "Striker"
  };

  return labels[position] || position;
};

// ============================================================
// SCORE BREAKDOWN
// ============================================================

/*
  Useful for your player-details page.

  This lets the UI show WHAT is driving the META score.
*/

export const getMetaBreakdown = (player) => {
  if (!player) {
    return null;
  }

  const position = String(
    player.position || ""
  ).toUpperCase();

  if (position === "GK") {
    return {
      Diving: clamp(player.pace),
      Handling: clamp(player.shooting),
      Kicking: clamp(player.passing),
      Reflexes: clamp(player.dribbling),
      Speed: clamp(player.defending),
      Positioning: clamp(player.physical)
    };
  }

  return {
    Pace: clamp(player.pace),
    Shooting: clamp(player.shooting),
    Passing: clamp(player.passing),
    Dribbling: clamp(player.dribbling),
    Defending: clamp(player.defending),
    Physical: clamp(player.physical)
  };
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default calculateMetaScore;