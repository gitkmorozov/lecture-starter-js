import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) {
        return fighterElement;
    }

    const { source, name, health, attack, defense } = fighter;
    const imageElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes: { src: source, title: name, alt: name }
    });
    const infoElement = createElement({ tagName: 'div', className: 'fighter-preview___info' });
    const stats = [`Name: ${name}`, `Health: ${health}`, `Attack: ${attack}`, `Defense: ${defense}`];

    stats.forEach(text => {
        const statElement = createElement({ tagName: 'span', className: 'fighter-preview___stat' });
        statElement.innerText = text;
        infoElement.append(statElement);
    });

    fighterElement.append(imageElement, infoElement);

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
