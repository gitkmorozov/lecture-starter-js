import showModal from './modal';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const { name, source } = fighter;
    const bodyElement = createElement({ tagName: 'div', className: 'winner-modal' });
    const image = createElement({
        tagName: 'img',
        className: 'winner-modal___image',
        attributes: { src: source, title: name, alt: name }
    });

    bodyElement.append(image);

    showModal({
        title: `${name} wins!`,
        bodyElement,
        onClose: () => window.location.reload()
    });
}
