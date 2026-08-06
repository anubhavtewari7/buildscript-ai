import React, { useState, useEffect } from 'react';
import { Vehicle, MaintenanceItem } from '../types';
import { CheckCircle2, Clock, Plus, X, AlertTriangle } from 'lucide-react';

interface MaintenanceProps { vehicle: Vehicle; }

const DEFAULT_ITEMS = (vehicle: Vehicle): MaintenanceItem[] => [
  { id: '1', title: 'Oil Change', dueDate: '', dueMileage: vehicle.mileage + 5000, completed: false },
  { id: '2', title: 'Tire Rotation', dueDate: '', dueMileage: vehicle.mileage + 7500, completed: false },
  { id: '3', title: 'Brake Inspection', dueDate: '', dueMileage: vehicle.mileage + 12000, completed: false },
  { id: '4', title: 'Air Filter Replacement', dueDate: '', dueMileage: vehicle.mileage + 15000, completed: false },
  { id: '5', title: 'Coolant Flush', dueDate: '', dueMileage: vehicle.mileage + 30000, completed: false },
];

const Maintenance: React.FC<MaintenanceProps> = ({ vehicle }) => {
  const storageKey = `bs_maintenance_${vehicle.id}`;
  const [items, setItems] = useState<MaintenanceItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_ITEMS(vehicle);
    } catch { return DEFAULT_ITEMS(vehicle); }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueMileage, setNewDueMileage] = useState('');

  const save = (updated: MaintenanceItem[]) => {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`bs_maintenance_${vehicle.id}`);
      setItems(saved ? JSON.parse(saved) : DEFAULT_ITEMS(vehicle));
    } catch {
      setItems(DEFAULT_ITEMS(vehicle));
    }
  }, [vehicle.id]);

  const toggle = (id: string) => save(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  const remove = (id: string) => save(items.filter(i => i.id !== id));

  const addItem = () => {
    if (!newTitle.trim()) return;
    const item: MaintenanceItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      dueDate: newDueDate,
      dueMileage: parseInt(newDueMileage) || 0,
      completed: false,
    };
    save([...items, item]);
    setNewTitle(''); setNewDueDate(''); setNewDueMileage('');
    setShowAdd(false);
  };

  const pending = items.filter(i => !i.completed);
  const done = items.filter(i => i.completed);
  const overdue = pending.filter(i => i.dueMileage > 0 && vehicle.mileage >= i.dueMileage);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="px-6 pt-6 pb-4 pt-safe bg-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Maintenance</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-90 transition-all">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pending', value: pending.length, color: 'text-slate-900' },
            { label: 'Overdue', value: overdue.length, color: overdue.length > 0 ? 'text-red-600' : 'text-slate-900' },
            { label: 'Done', value: done.length, color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Overdue alert */}
        {overdue.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">
              {overdue.length} {overdue.length === 1 ? 'item is' : 'items are'} overdue based on your current mileage.
            </p>
          </div>
        )}

        {/* Pending items */}
        {pending.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Upcoming</p>
            <div className="space-y-3">
              {pending.map(item => {
                const isOverdue = item.dueMileage > 0 && vehicle.mileage >= item.dueMileage;
                return (
                  <div key={item.id} className={`bg-white rounded-2xl p-5 shadow-sm border ${isOverdue ? 'border-red-200' : 'border-slate-100'} flex items-center gap-4`}>
                    <button onClick={() => toggle(item.id)}
                      className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0 hover:border-emerald-500 transition-colors active:scale-90">
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 text-sm">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.dueMileage > 0 && (
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-slate-400'}`}>
                            <Clock size={11} />
                            {item.dueMileage.toLocaleString()} mi
                            {isOverdue && ' (Overdue)'}
                          </span>
                        )}
                        {item.dueDate && (
                          <span className="text-[10px] font-bold text-slate-400">by {new Date(item.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors active:scale-90">
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Done items */}
        {done.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Completed</p>
            <div className="space-y-2">
              {done.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 opacity-60">
                  <button onClick={() => toggle(item.id)}
                    className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 active:scale-90">
                    <CheckCircle2 size={14} className="text-white" />
                  </button>
                  <p className="font-bold text-slate-600 text-sm line-through">{item.title}</p>
                  <button onClick={() => remove(item.id)} className="ml-auto p-1.5 text-slate-300 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Add Item</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Title</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Spark Plug Replacement"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Due Date</label>
                  <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Due Mileage</label>
                  <input type="number" value={newDueMileage} onChange={e => setNewDueMileage(e.target.value)} placeholder="e.g. 85000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                </div>
              </div>
              <button onClick={addItem}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                Add to Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
