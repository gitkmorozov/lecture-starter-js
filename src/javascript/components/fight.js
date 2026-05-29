import controls from '../../constants/controls';

const CRITICAL_HIT_COOLDOWN = 10000;

function getRandomChance() {
    // random number in the range [1, 2)
    return Math.random() + 1;
}

export function getHitPower(fighter) {
    const { attack } = fighter;
    const criticalHitChance = getRandomChance();

    return attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const { defense } = fighter;
    const dodgeChance = getRandomChance();

    return defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);

    return damage > 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const sides = {
            left: { fighter: firstFighter, maxHealth: firstFighter.health, currentHealth: firstFighter.health },
            right: { fighter: secondFighter, maxHealth: secondFighter.health, currentHealth: secondFighter.health }
        };

        const pressedKeys = new Set();
        const lastCriticalHit = {
            [firstFighter._id]: 0,
            [secondFighter._id]: 0
        };

        const controller = new AbortController();
        const { signal } = controller;

        const updateHealthBar = position => {
            const side = sides[position];
            const healthBar = document.getElementById(`${position}-fighter-indicator`);
            const healthPercent = Math.max(0, (side.currentHealth / side.maxHealth) * 100);

            if (healthBar) {
                healthBar.style.width = `${healthPercent}%`;
            }
        };

        const applyDamage = (defenderPosition, damage) => {
            const defender = sides[defenderPosition];
            defender.currentHealth -= damage;
            updateHealthBar(defenderPosition);

            if (defender.currentHealth <= 0) {
                controller.abort();
                resolve(defenderPosition === 'left' ? sides.right.fighter : sides.left.fighter);
            }
        };

        const isComboPressed = combination => combination.every(key => pressedKeys.has(key));

        const tryCriticalHit = (attackerPosition, defenderPosition, combination) => {
            const attacker = sides[attackerPosition];
            const now = Date.now();
            const isReady = now - lastCriticalHit[attacker.fighter._id] >= CRITICAL_HIT_COOLDOWN;

            if (isComboPressed(combination) && isReady) {
                lastCriticalHit[attacker.fighter._id] = now;
                applyDamage(defenderPosition, 2 * attacker.fighter.attack);
            }
        };

        const performAttack = (attackerPosition, defenderPosition, attackerBlockKey, defenderBlockKey) => {
            // a fighter that is currently blocking cannot deal a hit
            if (pressedKeys.has(attackerBlockKey)) {
                return;
            }

            // a blocking defender amortizes the hit (getDamage); otherwise the hit lands fully
            const damage = pressedKeys.has(defenderBlockKey)
                ? getDamage(sides[attackerPosition].fighter, sides[defenderPosition].fighter)
                : getHitPower(sides[attackerPosition].fighter);

            applyDamage(defenderPosition, damage);
        };

        const handleKeyDown = event => {
            const { code } = event;

            // register the key first so simultaneous critical-hit combinations are detected
            pressedKeys.add(code);

            if (event.repeat) {
                return;
            }

            tryCriticalHit('left', 'right', controls.PlayerOneCriticalHitCombination);
            tryCriticalHit('right', 'left', controls.PlayerTwoCriticalHitCombination);

            if (code === controls.PlayerOneAttack) {
                performAttack('left', 'right', controls.PlayerOneBlock, controls.PlayerTwoBlock);
            }

            if (code === controls.PlayerTwoAttack) {
                performAttack('right', 'left', controls.PlayerTwoBlock, controls.PlayerOneBlock);
            }
        };

        const handleKeyUp = event => {
            pressedKeys.delete(event.code);
        };

        document.addEventListener('keydown', handleKeyDown, { signal });
        document.addEventListener('keyup', handleKeyUp, { signal });
    });
}
