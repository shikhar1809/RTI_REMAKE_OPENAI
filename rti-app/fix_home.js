import fs from 'fs';
const file = 'c:/Users/royal/Desktop/Archieve/RTI-REMAKE-OPENAI/rti-app/src/pages/home.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldState = `{stateInfo && (
                <div className="bg-white/95 border-2 border-gray-300 shadow-sm rounded-full px-6 py-2.5 flex items-center gap-3">
                  <span className="text-base font-medium text-gray-700 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <select
                      value={selectedStateId}
                      onChange={(e) => useAuthStore.getState().completeLocationStep(e.target.value)}
                      className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer hover:text-gray-900 appearance-none"
                    >
                      {Object.values(STATES).map((state) => (
                        <option key={state.id} value={state.id}>
                          {t(\`state_\${state.id}\`, state.name)}
                        </option>
                      ))}
                    </select>
                  </span>
                  <div className="w-px h-5 bg-gray-300"></div>
                  <span className="text-sm text-gray-600 font-bold">₹{stateInfo.fee}</span>
                </div>
              )}`;

const newState = `{stateInfo && (
                <div className="bg-white/95 border-2 border-gray-300 shadow-sm rounded-full px-4 sm:px-6 py-2 flex items-center gap-2 sm:gap-3 w-full max-w-[280px] sm:max-w-sm mx-auto justify-between shrink-0">
                  <span className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 shrink truncate">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 shrink-0"></span>
                    <select
                      value={selectedStateId}
                      onChange={(e) => useAuthStore.getState().completeLocationStep(e.target.value)}
                      className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer hover:text-gray-900 appearance-none truncate w-full"
                    >
                      {Object.values(STATES).map((state) => (
                        <option key={state.id} value={state.id}>
                          {t(\`state_\${state.id}\`, state.name)}
                        </option>
                      ))}
                    </select>
                  </span>
                  <div className="w-px h-4 sm:h-5 bg-gray-300 shrink-0 mx-1"></div>
                  <span className="text-sm text-gray-600 font-bold shrink-0">₹{stateInfo.fee}</span>
                </div>
              )}`;

c = c.replace(oldState, newState);

fs.writeFileSync(file, c, 'utf8');
