import React from 'react';
import { FileCode2, ExternalLink, Check, Copy, Server, Globe } from 'lucide-react';
import { baseURL } from '../api/axiosClient';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/order/',
    desc: 'Health check and service status verification',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    requestBody: null,
    responseSample: 'Spring Boot Project',
  },
  {
    method: 'POST',
    path: '/order/add',
    desc: 'Create a new order record with automatic ID generation',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    requestBody: {
      name: 'MacBook Pro 16',
      type: 'Electronics',
      status: 'Pending',
      location: 'San Francisco, CA',
    },
    responseSample: {
      orderId: 1,
      name: 'MacBook Pro 16',
      type: 'Electronics',
      status: 'Pending',
      location: 'San Francisco, CA',
      createdAt: '2026-10-27T10:00:00',
      updatedAt: '2026-10-27T10:00:00',
    },
  },
  {
    method: 'GET',
    path: '/order/displayall',
    desc: 'Retrieve all order records from MySQL database',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    requestBody: null,
    responseSample: [
      {
        orderId: 1,
        name: 'MacBook Pro 16',
        type: 'Electronics',
        status: 'Pending',
        location: 'San Francisco, CA',
      },
    ],
  },
  {
    method: 'GET',
    path: '/order/display?id={id}',
    desc: 'Retrieve single order details by primary key orderId',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    requestBody: null,
    responseSample: {
      orderId: 1,
      name: 'MacBook Pro 16',
      type: 'Electronics',
      status: 'Pending',
      location: 'San Francisco, CA',
    },
  },
  {
    method: 'PUT',
    path: '/order/update',
    desc: 'Update existing order attributes by orderId in body',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    requestBody: {
      orderId: 1,
      name: 'MacBook Pro 16 (Updated)',
      type: 'Electronics',
      status: 'Shipped',
      location: 'San Jose, CA',
    },
    responseSample: {
      orderId: 1,
      name: 'MacBook Pro 16 (Updated)',
      type: 'Electronics',
      status: 'Shipped',
      location: 'San Jose, CA',
    },
  },
  {
    method: 'DELETE',
    path: '/order/delete/{id}',
    desc: 'Delete order record by orderId path variable',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    requestBody: null,
    responseSample: 'Order Deleted Successfully',
  },
  {
    method: 'GET',
    path: '/order/displaybyname/{name}',
    desc: 'Search order records matching exact product/order name',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    requestBody: null,
    responseSample: [
      {
        orderId: 1,
        name: 'MacBook Pro 16',
        type: 'Electronics',
        status: 'Pending',
        location: 'San Francisco, CA',
      },
    ],
  },
  {
    method: 'GET',
    path: '/order/displaybytype/{type}',
    desc: 'Filter order records matching category/type',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    requestBody: null,
    responseSample: [
      {
        orderId: 1,
        name: 'MacBook Pro 16',
        type: 'Electronics',
        status: 'Pending',
        location: 'San Francisco, CA',
      },
    ],
  },
];

export default function ApiDocsView() {
  const swaggerUrl = `${baseURL}/swagger-ui.html`;
  const openApiUrl = `${baseURL}/v3/api-docs`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            REST API Reference
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive documentation and endpoint contracts for the Spring Boot Order Management Service.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={openApiUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            <span>OpenAPI Spec JSON</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <a
            href={swaggerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Open Swagger UI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Server className="w-4 h-4" />
          <span>Active Backend Service Target</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-mono text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 inline-block text-emerald-400">
            {baseURL}
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            Configured through environment variable <code className="text-indigo-300">VITE_API_BASE_URL</code>.
            All client requests are routed through the centralized Axios client.
          </p>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Verified REST Endpoints (8)</h2>

        <div className="grid grid-cols-1 gap-4">
          {ENDPOINTS.map((ep, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3 hover:border-indigo-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border font-mono ${ep.color}`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-xs text-slate-500">{ep.desc}</span>
              </div>

              {ep.requestBody && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Request Body (JSON)
                  </div>
                  <pre className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-800 overflow-x-auto">
                    {JSON.stringify(ep.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Response Sample
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
                  {typeof ep.responseSample === 'string'
                    ? ep.responseSample
                    : JSON.stringify(ep.responseSample, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
