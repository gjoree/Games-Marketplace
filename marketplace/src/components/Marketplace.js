// import { useEffect, useState, useCallback } from 'react'
// import useAuthUser from '../hooks/useAuthUser'

// import heroIcon from '../assets/heroIcon.png'
// import swordIcon from '../assets/swordIcon.png'
// import axeIcon from '../assets/Raider-Axe.png'
// import fireballIcon from '../assets/fireBallIcon.png'
// import knifeIcon from '../assets/knifeIcon.jpg'
// import spearIcon from '../assets/spearIcon.png'
// import fireSwordIcon from '../assets/fireSwordIcon.jpg'
// import fireKnifeIcon from '../assets/flamingKnifeIcon.png'
// import firebombIcon from '../assets/fireBombIcon.png'
// import carIcon from '../assets/carIcon.jpg'
// import visionIcon from '../assets/visionIcon.jpg'

// const GAMES = [
//   {
//     key: 'onslaught',
//     name: 'Onslaught Arena',
//     image: 'https://www.typinggames.zone/web/game-thumbnails/arena2.png',
//   },
//   {
//     key: 'racer',
//     name: 'Top Racer',
//     image: 'https://img.youtube.com/vi/Y92aG3YagXU/hqdefault.jpg',
//   },
// ]

// const RACER_UPGRADE_KEYS = {
//   Vehicle: ['speed', 'acceleration', 'braking'],
//   Vision: ['fog_density', 'draw_distance'],
// }

// const UPGRADE_KEYS = {
//   Hero: ['hero.health', 'hero.speed'],
//   Sword: ['sword.damage', 'sword.speed', 'sword.firingRate'],
//   Knife: ['knife.damage', 'knife.speed', 'knife.firingRate'],
//   Spear: ['spear.damage', 'spear.speed', 'spear.firingRate'],
//   FireSword: ['fire_sword.damage', 'fire_sword.speed', 'fire_sword.firingRate'],
//   FireKnife: ['fire_knife.damage', 'fire_knife.speed', 'fire_knife.firingRate'],
//   Firebomb: ['firebomb.damage', 'firebomb.speed', 'firebomb.firingRate'],
//   Axe: ['axe.damage', 'axe.speed', 'axe.firingRate'],
//   Fireball: ['fireball.damage', 'fireball.speed', 'fireball.firingRate'],
// }

// // Map categories to their icons
// const CATEGORY_ICONS = {
//   Hero: heroIcon,
//   Sword: swordIcon,
//   Knife: knifeIcon,
//   Spear: spearIcon,
//   FireSword: fireSwordIcon,
//   FireKnife: fireKnifeIcon,
//   Firebomb: firebombIcon,
//   Axe: axeIcon,
//   Fireball: fireballIcon,
//   Vehicle: carIcon,
//   Vision: visionIcon,
// }

// const Marketplace = () => {
//   const { user } = useAuthUser()
//   const [selectedGame, setSelectedGame] = useState(null)
//   const [upgrades, setUpgrades] = useState({})
//   const [coins, setCoins] = useState(0)
//   const [message, setMessage] = useState(null)

//   const formatKey = (key) => {
//     if (key.includes('.')) {
//       const [type, stat] = key.split('.')
//       const formattedType = type
//         .split('_')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ')
//       const formattedStat = stat
//         .replace(/([A-Z])/g, ' $1')
//         .split(' ')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ')
//       return `${formattedType} ${formattedStat}`
//     } else {
//       return key
//         .split('_')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ')
//     }
//   }

//   const fetchUpgrades = useCallback(() => {
//     if (!selectedGame) return
//     const route = selectedGame === 'onslaught' ? 'onslaught' : 'racer'
//     fetch(`${process.env.REACT_APP_API}/api/${route}/upgrades`, {
//       credentials: 'include',
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setCoins(data.coins || 0)
//         setUpgrades(data.upgrades || {})
//       })
//       .catch((err) => console.error('Failed to fetch upgrades:', err))
//   }, [selectedGame])

//   useEffect(() => {
//     fetchUpgrades()
//   }, [selectedGame, fetchUpgrades])

//   const handleUpgrade = async (key) => {
//     try {
//       window.scrollTo({ top: 0, behavior: 'smooth' })
//       const route = selectedGame === 'onslaught' ? 'onslaught' : 'racer'
//       const statKey = selectedGame === 'onslaught' ? key.replace('.', '_') : key

//       const res = await fetch(
//         `${process.env.REACT_APP_API}/api/${route}/upgrade`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ statKey }),
//         },
//       )
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || 'Upgrade failed')

//       fetchUpgrades()
//       setMessage({ type: 'success', text: 'Upgrade successful!' })
//     } catch (err) {
//       console.error('Upgrade error:', err)
//       setMessage({ type: 'error', text: err.message || 'Upgrade failed.' })
//     }

//     setTimeout(() => setMessage(null), 3000)
//   }

//   return (
//     <div
//       className='page-content'
//       style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}
//     >
//       {user ? (
//         <>
//           <h1 className='text-4xl md:text-5xl font-bold text-center mt-0 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea]'>
//             Welcome to the Marketplace
//           </h1>
//           <p className='text-lg text-gray-600 text-center mb-12'>
//             Select a game to upgrade stats.
//           </p>

//           <div
//             style={{
//               display: 'flex',
//               gap: '2rem',
//               marginBottom: '40px',
//               flexWrap: 'wrap',
//             }}
//           >
//             {GAMES.map((game) => (
//               <div
//                 key={game.key}
//                 onClick={() => setSelectedGame(game.key)}
//                 style={{
//                   border:
//                     selectedGame === game.key
//                       ? '2px solid #3498db'
//                       : '1px solid #ecf0f1',
//                   borderRadius: '10px',
//                   padding: '1rem',
//                   cursor: 'pointer',
//                   backgroundColor: '#fff',
//                   boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//                   transition: 'all 0.3s ease',
//                   width: '200px',
//                   textAlign: 'center',
//                 }}
//               >
//                 <img
//                   src={game.image}
//                   alt={game.name}
//                   style={{
//                     width: '100%',
//                     height: '120px',
//                     objectFit: 'cover',
//                     borderRadius: '8px',
//                     marginBottom: '10px',
//                   }}
//                 />
//                 <h3 style={{ margin: '0', color: '#2c3e50' }}>{game.name}</h3>
//               </div>
//             ))}
//           </div>

//           {selectedGame && (
//             <div
//               style={{
//                 backgroundColor: '#fff',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginBottom: '20px',
//                   paddingBottom: '15px',
//                   borderBottom: '1px solid #ecf0f1',
//                 }}
//               >
//                 <h2 style={{ margin: '0', color: '#2c3e50' }}>
//                   Available Upgrades
//                 </h2>
//                 <div
//                   style={{
//                     backgroundColor: '#f8f9fa',
//                     padding: '8px 15px',
//                     borderRadius: '20px',
//                     fontWeight: 'bold',
//                     color: '#27ae60',
//                   }}
//                 >
//                   Coins: {coins}
//                 </div>
//               </div>

//               {message && (
//                 <div
//                   style={{
//                     padding: '12px',
//                     marginBottom: '20px',
//                     color: message.type === 'success' ? '#27ae60' : '#e74c3c',
//                     backgroundColor:
//                       message.type === 'success'
//                         ? 'rgba(39, 174, 96, 0.1)'
//                         : 'rgba(231, 76, 60, 0.1)',
//                     border: `1px solid ${
//                       message.type === 'success' ? '#27ae60' : '#e74c3c'
//                     }`,
//                     borderRadius: '5px',
//                   }}
//                 >
//                   {message.text}
//                 </div>
//               )}

//               <div
//                 style={{
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//                   gap: '20px',
//                 }}
//               >
//                 {Object.entries(
//                   selectedGame === 'onslaught'
//                     ? UPGRADE_KEYS
//                     : RACER_UPGRADE_KEYS,
//                 ).map(([group, keys]) => (
//                   <div
//                     key={group}
//                     style={{
//                       backgroundColor: '#f8f9fa',
//                       padding: '15px',
//                       borderRadius: '8px',
//                       boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '10px',
//                         marginBottom: '15px',
//                       }}
//                     >
//                       <img
//                         src={CATEGORY_ICONS[group]}
//                         alt={group}
//                         style={{
//                           width: '32px',
//                           height: '32px',
//                           objectFit: 'contain',
//                           filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
//                         }}
//                       />
//                       <h3
//                         style={{
//                           margin: '0',
//                           color: '#6200ea',
//                           borderBottom: '1px solid #dfe6e9',
//                           paddingBottom: '8px',
//                           flex: 1,
//                         }}
//                       >
//                         {group} Upgrades
//                       </h3>
//                     </div>

//                     <ul
//                       style={{ listStyle: 'none', padding: '0', margin: '0' }}
//                     >
//                       {keys.map((key) => {
//                         const currentLevel =
//                           selectedGame === 'racer'
//                             ? upgrades[`${key}_level`] || 1
//                             : upgrades[key] || 1
//                         const upgradeCost = currentLevel * 100

//                         return (
//                           <li
//                             key={key}
//                             style={{
//                               display: 'flex',
//                               justifyContent: 'space-between',
//                               alignItems: 'center',
//                               marginBottom: '10px',
//                               padding: '8px 0',
//                               borderBottom: '1px dotted #dfe6e9',
//                             }}
//                           >
//                             <div>
//                               <div
//                                 style={{ fontWeight: '500', color: '#2c3e50' }}
//                               >
//                                 {formatKey(key)}
//                               </div>
//                               <div
//                                 style={{ fontSize: '0.9em', color: '#7f8c8d' }}
//                               >
//                                 Level: {currentLevel}
//                               </div>
//                             </div>

//                             <div
//                               style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '10px',
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   backgroundColor:
//                                     coins >= upgradeCost
//                                       ? '#e8f5e9'
//                                       : '#ffebee',
//                                   color:
//                                     coins >= upgradeCost
//                                       ? '#2e7d32'
//                                       : '#c62828',
//                                   padding: '4px 8px',
//                                   borderRadius: '4px',
//                                   fontSize: '0.85em',
//                                   fontWeight: 'bold',
//                                 }}
//                               >
//                                 {upgradeCost} coins
//                               </div>

//                               <button
//                                 onClick={() => handleUpgrade(key)}
//                                 disabled={coins < upgradeCost}
//                                 style={{
//                                   backgroundColor:
//                                     coins >= upgradeCost
//                                       ? '#6200ea'
//                                       : '#b39ddb',
//                                   color: 'white',
//                                   border: 'none',
//                                   padding: '6px 12px',
//                                   borderRadius: '4px',
//                                   cursor:
//                                     coins >= upgradeCost
//                                       ? 'pointer'
//                                       : 'not-allowed',
//                                   transition: 'background-color 0.2s',
//                                   opacity: coins >= upgradeCost ? 1 : 0.7,
//                                   minWidth: '80px',
//                                 }}
//                               >
//                                 Upgrade
//                               </button>
//                             </div>
//                           </li>
//                         )
//                       })}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div style={{ textAlign: 'center', padding: '40px 20px' }}>
//           <h1 className='text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea]'>
//             Welcome to the Marketplace
//           </h1>
//           <p style={{ fontSize: '1.3em' }}>
//             Discover and shop for unique items in our marketplace.
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Marketplace
