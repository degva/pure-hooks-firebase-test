import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MainContainer } from './MainContainer';

export interface Item {
  id?: string;
  text: string;
  isDone: boolean;
  parent: string;
  children?: Item[];
}

export const PrincipalComponent: React.FC = () => {
  const db = firebase.firestore();

  // START states
  const [data, _setData] = React.useState<{ loading: boolean; items: Item[] }>({
    loading: true,
    items: []
  });
  const [level, _setLevel] = React.useState({
    route: 'main',
    titles: 'Main'
  });
  const [newText, _setNewText] = React.useState('');
  // END states

  // START Data related functions
  const getDataForCurrentLevel = () => {
    const levels = level.route.split('.');
    const currentLevel = levels[levels.length - 1];
    const thisLevel = data.items.filter(i => i.id!! === currentLevel)[0];
    const childrenIds = (thisLevel.children || []).map(c => c.id!!);
    const _data = [
      {
        ...thisLevel,
        id: currentLevel,
        children: data.items.filter(i => childrenIds.includes(i.id!!))
      }
    ];

    return _data;
  };

  const addItem = async (item: Item) => {
    const levels = level.route.split('.');
    const new_id = Date.now();
    await db
      .collection('items')
      .doc(`${new_id}`)
      .set(item);
    db.collection('items')
      .doc(levels[levels.length - 1])
      .update({
        children: firebase.firestore.FieldValue.arrayUnion(
          db.doc(`items/${new_id}`)
        )
      });
  };

  const setLevel = (_l: string, _t: string = 'what') => {
    const levels = level.route.split('.');
    const titles = level.titles.split('.');
    const idxLevel = levels.findIndex(i => i === _l);
    let newLevel = '';
    let newTitles = '';
    if (idxLevel !== -1) {
      newLevel = levels.slice(0, idxLevel).join('.');
      newTitles = titles.slice(0, idxLevel).join('.');
    } else {
      newLevel = `${level.route}.${_l}`;
      newTitles = `${level.titles}.${_t}`;
    }
    _setLevel({ route: newLevel, titles: newTitles });
  };

  // END Data related functions

  React.useEffect(() => {
    db.collection('items').onSnapshot(async qsp => {
      const items: Item[] = [];

      qsp.docs.forEach(doc => {
        items.push({ id: doc.id, ...(doc.data() as Item) });
      });

      _setData({
        loading: false,
        items
      });
    });
  }, [db]);

  // For breadcrumbs
  let levels = level.route.split('.');
  let titles = level.titles.split('.');

  levels = levels.slice(1, levels.length);
  titles = titles.slice(0, titles.length - 1);

  const levels_titles = levels.map((x, i) => ({ route: x, title: titles[i] }));
  return (
    <>
      <ol className="breadcrumb">
        {levels_titles.map((l, idx) => (
          <li key={`levelkey_${idx}`} onClick={() => setLevel(l.route)}>
            {l.title}
          </li>
        ))}
      </ol>
      <MainContainer
        loading={data.loading}
        items={data.loading ? [] : getDataForCurrentLevel()}
        setLevel={setLevel}
      />
      <div className="newItem">
        <input
          value={newText}
          onChange={e => _setNewText(e.target.value)}
          placeholder="New item..."
          onKeyPress={k => {
            if (k.key === 'Enter') {
              addItem({
                text: newText,
                isDone: false,
                parent: levels[levels.length - 1] || 'main'
              });
              _setNewText('');
            }
          }}
        />
        <button
          onClick={() => {
            addItem({
              text: newText,
              isDone: false,
              parent: levels[levels.length - 1] || 'main'
            });
            _setNewText('');
          }}
        >
          Add new
        </button>
      </div>
    </>
  );
};
