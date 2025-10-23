"use client";

import { Security } from "@/types/securities";
import { useSecurities } from "@/store/useSecurities";
import { X } from "lucide-react";

interface Props {
  security: Security | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SecuritiesDetailsDrawer({ security, isOpen, onClose }: Props) {
  if (!isOpen || !security) return null;

  const vestingProgress = security.vestingSchedule
    ? (security.vestingSchedule.vestedShares / security.vestingSchedule.totalShares) * 100
    : 0;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 40
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100%",
          width: "384px",
          background: "var(--background)",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          zIndex: 50,
          overflowY: "auto"
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "var(--background)",
            borderBottom: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10
          }}
        >
          <h2 style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--primary)",
            margin: 0
          }}>
            Security Details
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "4px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--secondary)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Basic Information */}
          <div>
            <h3 style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px"
            }}>Basic Information</h3>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "var(--primary)",
              borderRadius: "6px",
              padding: "12px",
              opacity: 0.05
            }} />
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>ID</span>
                <span style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--primary)"
                }}>{security.id}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Holder Name</span>
                <span style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--primary)"
                }}>{security.holderName}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Type</span>
                <span style={{
                  background: "#e0e7ff",
                  color: "#312e81",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "600"
                }}>
                  {security.type}
                </span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Status</span>
                <span style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "600"
                }}>
                  {security.status}
                </span>
              </div>
            </div>
          </div>

          {/* Share Information */}
          <div>
            <h3 style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "var(--primary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "12px"
            }}>Share Information</h3>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Shares</span>
                <span style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--primary)"
                }}>{security.shares.toLocaleString()}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Value per Share</span>
                <span style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--primary)"
                }}>${security.value.toFixed(2)}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Total Value</span>
                <span style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "var(--primary)"
                }}>${(security.shares * security.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)" }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)"
                }}>Issue Date</span>
                <span style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "var(--primary)"
                }}>{security.issueDate}</span>
              </div>
            </div>
          </div>

          {/* Vesting Schedule */}
          {security.vestingSchedule && (
            <div>
              <h3 style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px"
              }}>Vesting Schedule</h3>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--secondary)"
                  }}>Vested Shares</span>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}>
                    {security.vestingSchedule.vestedShares.toLocaleString()}
                  </span>
                </div>
                <div style={{ borderBottom: "1px solid var(--border)" }} />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--secondary)"
                  }}>Total Shares</span>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}>
                    {security.vestingSchedule.totalShares.toLocaleString()}
                  </span>
                </div>
                <div style={{ borderBottom: "1px solid var(--border)" }} />
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <span style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--secondary)"
                    }}>Vesting Progress</span>
                    <span style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#10b981"
                    }}>{vestingProgress.toFixed(1)}% vested</span>
                  </div>
                  <div style={{
                    width: "100%",
                    height: "6px",
                    background: "var(--border)",
                    borderRadius: "3px",
                    overflow: "hidden"
                  }}>
                    <div
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                        width: `${vestingProgress}%`,
                        transition: "width 0.3s ease"
                      }}
                    />
                  </div>
                </div>
                <div style={{ borderBottom: "1px solid var(--border)" }} />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--secondary)"
                  }}>Start Date</span>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}>{security.vestingSchedule.vestingStartDate}</span>
                </div>
                <div style={{ borderBottom: "1px solid var(--border)" }} />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--secondary)"
                  }}>End Date</span>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--primary)"
                  }}>{security.vestingSchedule.vestingEndDate}</span>
                </div>
                {security.vestingSchedule.cliffMonths && (
                  <>
                    <div style={{ borderBottom: "1px solid var(--border)" }} />
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--secondary)"
                      }}>Cliff Period</span>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--primary)"
                      }}>{security.vestingSchedule.cliffMonths} months</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Transaction History */}
          {security.transactions && security.transactions.length > 0 && (
            <div>
              <h3 style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px"
              }}>Transaction History</h3>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {security.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    style={{
                      background: "var(--border)",
                      borderRadius: "6px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "var(--primary)"
                      }}>{tx.type}</span>
                      <span style={{
                        fontSize: "11px",
                        color: "var(--secondary)"
                      }}>{tx.date}</span>
                    </div>
                    <span style={{
                      fontSize: "11px",
                      color: "var(--secondary)"
                    }}>Qty: {tx.quantity.toLocaleString()}</span>
                    {tx.notes && (
                      <span style={{
                        fontSize: "11px",
                        color: "var(--secondary)",
                        fontStyle: "italic"
                      }}>{tx.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {security.documents && security.documents.length > 0 && (
            <div>
              <h3 style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px"
              }}>Documents</h3>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {security.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      background: "var(--border)",
                      borderRadius: "6px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <p style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--primary)",
                        margin: 0,
                        marginBottom: "4px"
                      }}>
                        {doc.name}
                      </p>
                      <p style={{
                        fontSize: "11px",
                        color: "var(--secondary)",
                        margin: 0
                      }}>
                        {doc.type}
                      </p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#3b82f6",
                        fontSize: "11px",
                        fontWeight: "600",
                        textDecoration: "none",
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1d4ed8")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}>
            <p style={{
              fontSize: "11px",
              color: "var(--secondary)",
              margin: 0
            }}>
              Created: <span style={{ fontWeight: "600" }}>{security.createdAt}</span>
            </p>
            <p style={{
              fontSize: "11px",
              color: "var(--secondary)",
              margin: 0
            }}>
              Updated: <span style={{ fontWeight: "600" }}>{security.updatedAt}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
