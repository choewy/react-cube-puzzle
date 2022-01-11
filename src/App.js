import { useRef, useState } from 'react';
import './index.css';

const getNearBlocks = (row, col) => {
  return [
    [row - 1, col],
    [row, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ];
};

const changeBlockClassName = (block) => {
  if (block) {
    block.className = block.className.split('_')[0] === 'close'
      ? 'open'
      : 'close'
  };
};

const changeModalDisplay = (ref, display) => {
  if (ref) {
    ref.current.style.display = display;
  };
};

const changeBlocksToClose = (ref) => {
  if (ref) {
    [...ref.current.firstChild.children].forEach(line => {
      [...line.firstChild.children].forEach(block => {
        block.className = 'close';
      });
    });
  };
};

const App = () => {
  const gameBoard = useRef();
  const clearModal = useRef();

  const [stage, setStage] = useState(1);

  const handleMouseOverBlock = (status, row, col) => {
    const blocks = getNearBlocks(row, col);
    blocks.forEach(target => {
      const [y, x] = target;
      const block = gameBoard.current.firstChild.children[y]
        ? gameBoard.current.firstChild.children[y].firstChild.children[x]
        : undefined;
      if (block) {
        block.className = status === 'over'
          ? block.className + '_hover'
          : block.className.split('_')[0]
      }
    });
  };

  const handleMouseClickBlock = (row, col) => {
    const blocks = getNearBlocks(row, col);
    blocks.forEach(target => {
      const [y, x] = target;
      const block = gameBoard.current.firstChild.children[y]
        ? gameBoard.current.firstChild.children[y].firstChild.children[x]
        : undefined;
      changeBlockClassName(block, 'open');
    });

    let iSClear = true;
    [...gameBoard.current.firstChild.children].forEach(line => {
      [...line.firstChild.children].forEach(block => {
        if (block.className === 'close') {
          iSClear = false;
          return iSClear;
        }
      });
      return iSClear;
    });

    if (iSClear) {
      changeModalDisplay(clearModal, 'flex');
    };
  };

  const handleClickNextStage = () => {
    changeBlocksToClose(gameBoard);
    changeModalDisplay(clearModal, 'none');
    setStage(stage + 1);
  };

  return (
    <div className='wrapper'>
      <div className='titleBox'>
        <h1>Cube Puzzle</h1>
        <h2>Stage : {stage}</h2>
        <p>모든 블럭을 밝게 만들어보세요.</p>
        <p>몇 단계까지 가능할까요?</p>
      </div>
      <div className="clearModal" ref={clearModal}>
        <span>Clear!</span>
        <button onClick={handleClickNextStage}>다음 난이도</button>
      </div>
      <div className='gameBoard' ref={gameBoard}>
        <ul style={{ width: `${400}px` }}>
          {[...Array(stage + 1)].map((y, row) => (
            <li key={row} style={{ height: `${Math.floor(400 / (stage + 1))}px` }}>
              <ul>
                {[...Array(stage + 1)].map((x, col) =>
                  <li key={`${row}${col}`}
                    className='close'
                    style={{
                      width: `${Math.floor(400 / (stage + 1))}px`,
                      height: `${Math.floor(400 / (stage + 1))}px`
                    }}
                    onMouseOver={() => { handleMouseOverBlock('over', row, col) }}
                    onMouseLeave={() => { handleMouseOverBlock('leave', row, col) }}
                    onClick={() => { handleMouseClickBlock(row, col); }} />
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className='utilBox'>
        <button onClick={() => { changeBlocksToClose(gameBoard) }}>초기화</button>
      </div>
    </div>
  )
}

export default App;