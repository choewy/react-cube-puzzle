import { useRef, useState } from 'react';
import './index.css';

const App = () => {
  const gameBoard = useRef();
  const nextModal = useRef();

  const [stage, setStage] = useState(1);

  const blockHover = (status, row, col) => {
    const targets = [
      [row - 1, col],
      [row, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1]
    ];
    targets.forEach(target => {
      const [y, x] = target;
      const block = gameBoard.current.firstChild.children[y]
        ? gameBoard.current.firstChild.children[y].firstChild.children[x]
        : undefined;
      if (block) {
        if (status === 'over') {
          block.className += '_hover';
        } else {
          block.className = block.className.split('_')[0];
        }
      }
    });
  };

  const blockClick = (row, col) => {
    const targets = [
      [row - 1, col],
      [row, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1]
    ];
    targets.forEach(target => {
      const [y, x] = target;
      const block = gameBoard.current.firstChild.children[y]
        ? gameBoard.current.firstChild.children[y].firstChild.children[x]
        : undefined;
      if (block) {
        block.className = block.className.split('_').includes('close')
          ? block.className = 'open'
          : block.className = 'close'
      }
    });

    let next = true;
    [...gameBoard.current.firstChild.children].forEach(line => {
      [...line.firstChild.children].forEach(block => {
        if (block.className === 'close') {
          next = false;
          return next;
        }
      });
      return next;
    });

    if (next) {
      nextModal.current.style.display = 'flex';
    };
  };

  const closeAllBlocks = () => {
    [...gameBoard.current.firstChild.children].forEach(line => {
      [...line.firstChild.children].forEach(block => {
        block.className = 'close';
      });
    });
  };

  const nextStageClick = () => {
    closeAllBlocks();
    nextModal.current.style.display = 'none';
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
      <div className="nextModal" ref={nextModal}>
        <span>Clear!</span>
        <button onClick={nextStageClick}>다음 난이도</button>
      </div>
      <div className='gameBoard' ref={gameBoard}>
        <ul style={{ width: `${500}px` }}>
          {[...Array(stage + 1)].map((y, row) => (
            <li key={row} style={{ height: `${Math.floor(500 / (stage + 1))}px` }}>
              <ul>
                {[...Array(stage + 1)].map((x, col) =>
                  <li key={`${row}${col}`}
                    className='close'
                    style={{
                      width: `${Math.floor(500 / (stage + 1))}px`,
                      height: `${Math.floor(500 / (stage + 1))}px`
                    }}
                    onMouseOver={() => { blockHover('over', row, col) }}
                    onMouseLeave={() => { blockHover('leave', row, col) }}
                    onClick={() => { blockClick(row, col); }} />
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App;