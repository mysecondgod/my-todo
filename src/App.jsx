import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Star, 
  Clock, 
  AlertCircle, 
  LayoutGrid, 
  List,
  ChevronRight,
  Filter
} from 'lucide-react';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [view, setView] = useState('matrix'); // 'matrix' (四象限视图) 或 'list' (列表视图)

  // 1. 初始化：从本地存储获取数据
  useEffect(() => {
    const saved = localStorage.getItem('organized_todos_pro');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("解析本地存储数据失败", e);
      }
    }
  }, []);

  // 2. 持久化：当 todos 变化时保存到本地存储
  useEffect(() => {
    localStorage.setItem('organized_todos_pro', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      priority, // 'high', 'medium', 'low'
      createdAt: new Date().toISOString()
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // 象限容器组件
  const Quadrant = ({ title, subtitle, items, colorClass, icon: Icon }) => (
    <div className={`flex flex-col h-full rounded-2xl border-2 p-5 ${colorClass} transition-all`}>
      <div className="mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-xs opacity-60 font-medium">{subtitle}</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs opacity-30 italic">
            暂无任务
          </div>
        ) : (
          items.map(todo => (
            <div 
              key={todo.id} 
              className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm flex items-center justify-between group animate-in fade-in slide-in-from-bottom-1"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={() => toggleTodo(todo.id)} className="shrink-0">
                  {todo.completed ? 
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                    <Circle className="w-5 h-5 text-gray-300" />
                  }
                </button>
                <span className={`truncate text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-slate-700'}`}>
                  {todo.text}
                </span>
              </div>
              <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const highUrgent = todos.filter(t => t.priority === 'high' && !t.completed);
  const highNotUrgent = todos.filter(t => t.priority === 'medium' && !t.completed);
  const lowUrgent = todos.filter(t => t.priority === 'low' && !t.completed);
  const completed = todos.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* 页眉 */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              清爽待办 <span className="text-blue-600 italic">PRO</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">整理你的大脑，专注于真正重要的事</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setView('matrix')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'matrix' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <LayoutGrid className="w-4 h-4" /> 象限视图
            </button>
            <button 
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <List className="w-4 h-4" /> 列表视图
            </button>
          </div>
        </header>

        {/* 输入框区域 */}
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-10 transition-all">
          <form onSubmit={addTodo} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="在此输入新的待办事项..."
                className="w-full pl-6 pr-4 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-semibold text-lg transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-6 py-5 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none text-slate-600"
              >
                <option value="high">紧急且重要 🔥</option>
                <option value="medium">重要不紧急 ⭐</option>
                <option value="low">稍后处理 ☕</option>
              </select>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-blue-200 flex items-center gap-2 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <Plus className="w-6 h-6" /> 添加任务
              </button>
            </div>
          </form>
        </div>

        {/* 主体视图 */}
        {view === 'matrix' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[600px]">
            <Quadrant 
              title="重要且紧急" 
              subtitle="DO IT NOW - 立即执行" 
              items={highUrgent} 
              icon={AlertCircle}
              colorClass="bg-red-50/50 border-red-100 text-red-900" 
            />
            <Quadrant 
              title="重要不紧急" 
              subtitle="SCHEDULE IT - 计划安排" 
              items={highNotUrgent} 
              icon={Star}
              colorClass="bg-orange-50/50 border-orange-100 text-orange-900" 
            />
            <Quadrant 
              title="稍后处理" 
              subtitle="DELEGATE/BATCH - 委派或批量" 
              items={lowUrgent} 
              icon={Clock}
              colorClass="bg-blue-50/50 border-blue-100 text-blue-900" 
            />
            <Quadrant 
              title="已完成任务" 
              subtitle="CELEBRATE - 阶段性成果" 
              items={completed} 
              icon={CheckCircle2}
              colorClass="bg-emerald-50/50 border-emerald-100 text-emerald-900" 
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <h2 className="font-black text-slate-400 uppercase tracking-widest text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" /> 任务流 ({todos.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
              {todos.length === 0 ? (
                <div className="p-20 text-center text-slate-300 font-bold text-xl">
                  列表空空如也，开启高效一天吧！
                </div>
              ) : (
                todos.map(todo => (
                  <div key={todo.id} className="p-5 hover:bg-slate-50/50 flex items-center justify-between group transition-colors">
                    <div className="flex items-center gap-5 flex-1 mr-4">
                      <button onClick={() => toggleTodo(todo.id)} className="shrink-0">
                        {todo.completed ? 
                          <CheckCircle2 className="w-7 h-7 text-green-500" /> : 
                          <Circle className="w-7 h-7 text-slate-200" />
                        }
                      </button>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-bold text-lg truncate ${todo.completed ? 'line-through text-slate-300 font-normal' : 'text-slate-700'}`}>
                          {todo.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-black uppercase tracking-tighter ${getPriorityBadge(todo.priority)}`}>
                            {todo.priority === 'high' ? 'High' : todo.priority === 'medium' ? 'Medium' : 'Low'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            创建于 {new Date(todo.id).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteTodo(todo.id)} className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 底部贴士 */}
        <footer className="mt-16 border-t border-slate-200 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">1</div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">先吃掉那只青蛙</h5>
                <p className="text-xs text-slate-500 leading-relaxed">每天醒来先处理最棘手的那件“高优先级”任务，剩下的时间会无比轻松。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-black">2</div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">二分钟原则</h5>
                <p className="text-xs text-slate-500 leading-relaxed">如果回复邮件或洗个碗只需两分钟，不要记在列表里，立刻去完成它。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-black">3</div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">定期清空列表</h5>
                <p className="text-xs text-slate-500 leading-relaxed">养成删除已完成任务的习惯，保持界面的整洁有助于降低焦虑水平。</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;