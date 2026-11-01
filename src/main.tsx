import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Aperture, BookOpen, Check, ChevronDown, CirclePlay, Clock3, Download,
  Film, FolderKanban, MessageSquareText, MoreHorizontal, Music2, Plus,
  Scissors, Search, Settings, Sparkles, Upload, WandSparkles, X
} from 'lucide-react';
import './styles.css';

type Shot = {
  id: number; time: string; title: string; dialogue: string; visual: string;
  edit: string; color: string; duration: number;
};

const initialShots: Shot[] = [
  { id: 1, time: '00:00–00:04', title: '开场钩子', dialogue: '孩子上课总走神，真不一定是态度问题。', visual: '老师正面近景，直视镜头；前 0.5 秒直接入画', edit: '快速推近 8%；“走神”关键词放大；加轻微冲击音', color: '#eb6c45', duration: 4 },
  { id: 2, time: '00:04–00:13', title: '打破误区', dialogue: '很多家长第一反应是批评，但注意力不是靠骂出来的。', visual: '保持主机位，中间插入孩子写作业的 B-roll', edit: '在“批评”处跳切；B-roll 覆盖 2.5 秒；字幕逐词出现', color: '#6558e8', duration: 9 },
  { id: 3, time: '00:13–00:28', title: '给出方法', dialogue: '先把任务拆成十分钟的小段，每完成一段，就给孩子一个明确反馈。', visual: '侧机位示范任务卡，手部特写展示计时器', edit: '双机位交替；步骤一、步骤二花字；计时器加滴答音', color: '#2da982', duration: 15 },
  { id: 4, time: '00:28–00:39', title: '案例证明', dialogue: '我们班有个孩子，用这个方法两周后，能独立专注半小时。', visual: '老师半身景，右侧出现匿名前后对比卡片', edit: '降低背景音乐；数据卡从右侧滑入；保留自然停顿', color: '#d99d36', duration: 11 },
  { id: 5, time: '00:39–00:46', title: '行动引导', dialogue: '先别急着责备，今晚就试一次。想要任务卡模板，评论区告诉我。', visual: '回到正面近景，语气温和，结尾停留 1 秒', edit: '结尾音乐上扬；CTA 字幕居中；最后一帧定格', color: '#4089cf', duration: 7 },
];

const workflow: Array<[string, string, boolean]> = [
  ['素材', '已上传', true], ['分析', '已完成', true], ['剪辑脚本', '编辑中', true],
  ['自动剪辑', '待开始', false], ['成片', '待确认', false],
];

function App() {
  const [shots, setShots] = useState(initialShots);
  const [selected, setSelected] = useState(1);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: '我已根据素材生成 46 秒知识口播剪辑脚本。节奏重点放在前三秒钩子和方法演示。你可以直接告诉我想改哪一段。' }
  ]);
  const [confirmed, setConfirmed] = useState(false);
  const current = shots.find(s => s.id === selected)!;

  const send = () => {
    if (!message.trim()) return;
    setMessages(m => [...m, { role: 'user', text: message }, { role: 'ai', text: '收到。我会保留核心观点，将开场压缩并提高节奏。这里先记录为修改指令，接入模型后会自动更新脚本和时间线。' }]);
    setMessage('');
  };

  const updateCurrent = (key: keyof Shot, value: string) =>
    setShots(all => all.map(s => s.id === selected ? { ...s, [key]: value } : s));

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Aperture size={21}/></div><span>FrameFlow</span></div>
      <button className="new-project"><Plus size={17}/>新建剪辑项目</button>
      <nav>
        <div className="nav-label">工作台</div>
        <a className="active"><FolderKanban size={18}/>剪辑项目 <span>4</span></a>
        <a><Upload size={18}/>素材库</a>
        <a><BookOpen size={18}/>知识库</a>
        <div className="nav-label second">沉淀</div>
        <a><WandSparkles size={18}/>剪辑 Skill <b>即将上线</b></a>
        <a><Film size={18}/>成片库</a>
      </nav>
      <div className="recent">
        <div className="nav-label">最近项目</div>
        <div className="recent-item"><i className="dot orange"/><div><strong>注意力训练口播</strong><small>刚刚编辑</small></div></div>
        <div className="recent-item"><i className="dot purple"/><div><strong>期中家长会 Vlog</strong><small>昨天</small></div></div>
        <div className="recent-item"><i className="dot green"/><div><strong>数学提分技巧</strong><small>10 月 29 日</small></div></div>
      </div>
      <div className="profile"><div className="avatar">林</div><div><strong>林老师团队</strong><small>教育机构工作区</small></div><MoreHorizontal size={18}/></div>
    </aside>

    <main>
      <header>
        <div className="crumb"><span>剪辑项目</span><b>/</b><strong>注意力训练口播</strong><ChevronDown size={15}/></div>
        <div className="header-actions"><button className="icon-btn"><Search size={18}/></button><button className="icon-btn"><Settings size={18}/></button><span className="saved"><Check size={14}/>已保存</span><button className="export"><Download size={16}/>导出</button></div>
      </header>

      <section className="content">
        <div className="project-head">
          <div><div className="eyebrow">知识口播 · 9:16</div><h1>注意力训练口播</h1><p>从原始素材到可执行剪辑脚本，再到最终成片</p></div>
          <button className={confirmed ? 'confirmed' : 'confirm'} onClick={() => setConfirmed(true)}>{confirmed ? <><Check size={17}/>脚本已确认</> : <><Sparkles size={17}/>确认脚本并开始剪辑</>}</button>
        </div>

        <div className="workflow">
          {workflow.map((w, i) => <React.Fragment key={w[0]}><div className={'step '+(i < 3 ? 'done' : '')}><div className="step-icon">{i < 2 ? <Check size={14}/> : i === 2 ? <Scissors size={15}/> : i === 3 ? <WandSparkles size={15}/> : <CirclePlay size={15}/>}</div><div><strong>{w[0]}</strong><small>{w[1]}</small></div></div>{i < workflow.length-1 && <div className={'line '+(i<2?'filled':'')}/>}</React.Fragment>)}
        </div>

        <div className="workspace-grid">
          <section className="script-panel panel">
            <div className="panel-title"><div><Scissors size={18}/><strong>剪辑脚本</strong><span>{shots.length} 个段落 · 46 秒</span></div><button><Plus size={15}/>添加段落</button></div>
            <div className="shot-list">
              {shots.map((s, idx) => <button key={s.id} className={'shot '+(selected===s.id?'selected':'')} onClick={()=>setSelected(s.id)}>
                <div className="shot-num" style={{background:s.color}}>{idx+1}</div><div className="shot-main"><div><strong>{s.title}</strong><span><Clock3 size={12}/>{s.time}</span></div><p>{s.dialogue}</p><small>{s.edit}</small></div><MoreHorizontal size={17}/>
              </button>)}
            </div>
          </section>

          <section className="detail-panel panel">
            <div className="panel-title"><div><Film size={18}/><strong>段落 {selected} · {current.title}</strong></div><button className="close"><X size={16}/></button></div>
            <div className="preview"><div className="phone-frame"><div className="teacher"><div className="board">专注力<br/><b>≠</b> 态度</div><div className="person"><span>林老师</span></div></div><button className="play"><CirclePlay size={36}/></button><div className="subtitle">孩子上课总走神，<em>真不一定</em>是态度问题</div></div><div className="preview-meta"><span>原始素材 01</span><small>00:00:18 / 00:02:34</small></div></div>
            <div className="form-block"><label>口播内容</label><textarea value={current.dialogue} onChange={e=>updateCurrent('dialogue',e.target.value)}/></div>
            <div className="form-block"><label>画面与机位</label><textarea value={current.visual} onChange={e=>updateCurrent('visual',e.target.value)}/></div>
            <div className="form-block accent"><label><Sparkles size={14}/>剪辑手法</label><textarea value={current.edit} onChange={e=>updateCurrent('edit',e.target.value)}/></div>
          </section>

          <section className="chat-panel panel">
            <div className="panel-title"><div><MessageSquareText size={18}/><strong>和 AI 一起调整</strong></div><span className="online">在线</span></div>
            <div className="chat-body">
              <div className="suggestions"><button onClick={()=>setMessage('把开头缩短到 3 秒，更有冲击力')}>开头更有冲击力</button><button onClick={()=>setMessage('整体控制在 40 秒以内')}>压缩到 40 秒</button><button onClick={()=>setMessage('字幕风格更年轻一点')}>字幕更年轻</button></div>
              {messages.map((m,i)=><div key={i} className={'msg '+m.role}>{m.role==='ai'&&<div className="ai-mark"><Sparkles size={14}/></div>}<p>{m.text}</p></div>)}
            </div>
            <div className="composer"><textarea placeholder="告诉 AI 你想怎么改…" value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}/><div><span>Enter 发送 · Shift + Enter 换行</span><button onClick={send}><Sparkles size={16}/></button></div></div>
          </section>
        </div>

        <section className="timeline panel">
          <div className="panel-title"><div><Music2 size={18}/><strong>时间线预览</strong><span>自动根据脚本更新</span></div><button><CirclePlay size={16}/>预览节奏</button></div>
          <div className="ruler"><span>00:00</span><span>00:10</span><span>00:20</span><span>00:30</span><span>00:40</span><span>00:46</span></div>
          <div className="track"><label>画面</label><div className="clips">{shots.map(s=><div key={s.id} style={{flex:s.duration,background:s.color}} className="clip">{s.title}</div>)}</div></div>
          <div className="track"><label>字幕</label><div className="caption-track">自动识别字幕 · 已校对 92%</div></div>
          <div className="track"><label>音乐</label><div className="audio-wave">{Array.from({length:70}).map((_,i)=><i key={i} style={{height:5+Math.abs(Math.sin(i*.7))*16}}/> )}</div></div>
        </section>
      </section>
    </main>
  </div>
}

createRoot(document.getElementById('root')!).render(<App/>);
