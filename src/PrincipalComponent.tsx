import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MainContainer } from './MainContainer';

export interface Item {
  id?: string;
  text: string;
  isDone: boolean;
  children?: Item[];
}

export const PrincipalComponent: React.FC = () => {
  const db = firebase.firestore();

  // START states
  const [data, _setData] = React.useState<{ loading: boolean; items: Item[] }>({
    loading: true,
    items: []
  });
  const [level, _setLevel] = React.useState({ route: 'main', titles: 'Main' });
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

  const addItem = (item: Item) => {
    const levels = level.route.split('.');
    db.collection('items')
      .add(item)
      .then(item => {
        db.collection('items')
          .doc(levels[levels.length - 1])
          .update({
            children: firebase.firestore.FieldValue.arrayUnion(
              db.doc(`items/${item.id}`)
            )
          });
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
  const levels = level.route.split('.');
  const titles = level.titles.split('.');
  const levels_titles = levels.map((x, i) => ({ route: x, title: titles[i] }));

  return (
    <>
      <ul>
        {levels_titles.map((l, idx) => (
          <li key={`levelkey_${idx}`} onClick={() => setLevel(l.route)}>
            {l.title}
          </li>
        ))}
      </ul>
      <MainContainer
        loading={data.loading}
        items={data.loading ? [] : getDataForCurrentLevel()}
        setLevel={setLevel}
      />
      <input
        value={newText}
        onChange={e => _setNewText(e.target.value)}
        onKeyPress={k => {
          if (k.key === 'Enter') {
            addItem({ text: newText, isDone: false });
            _setNewText('');
          }
        }}
      />
    </>
  );
};
