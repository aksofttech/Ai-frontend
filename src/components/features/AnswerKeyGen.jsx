import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Award, CheckCircle2 } from 'lucide-react';

export default function AnswerKeyGen() {
  const answers = [
    { qno: '1', answer: 'A mathematical model inspired by biological neural networks.', marks: '2', tips: 'Award 1 mark for mentioning "biological inspiration".' },
    { qno: '2', answer: 'Weights determine the strength of the connection; Biases shift the activation function.', marks: '3', tips: 'Needs an example for full marks.' },
    { qno: '3', answer: 'Through Backpropagation and Gradient Descent to minimize loss.', marks: '5', tips: 'Must mention both terms accurately.' },
  ];

  return (
    <GlassCard className="h-full flex flex-col p-0 overflow-hidden">
      <div className="p-6 border-b border-glass-border flex items-center justify-between bg-obsidian/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <CheckCircle2 className="text-emerald-green" />
          AI Generated Answer Key
        </h3>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <th className="pb-3 pl-2 w-16">Q.No</th>
              <th className="pb-3 w-1/3">Model Answer</th>
              <th className="pb-3 w-24 text-center">Marks</th>
              <th className="pb-3">Teacher Grading Tips</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {answers.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="py-4 pl-2 font-medium text-white">{row.qno}</td>
                <td className="py-4 pr-4 text-sm text-gray-300">{row.answer}</td>
                <td className="py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-green/20 text-emerald-green text-xs border border-emerald-green/30 font-medium">
                    <Award size={12} /> {row.marks}
                  </span>
                </td>
                <td className="py-4 text-sm text-gray-400 italic">{row.tips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
