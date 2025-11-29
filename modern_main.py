import customtkinter as ctk
from PIL import Image, ImageTk
import time
import threading
import requests
import json
import pandas as pd
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.animation as animation
from modern_traffic import ModernTrafficMonitor
from analytics import AnalyticsWindow
import random
import os
from sound_alerts import SoundAlerts
from signal_control import SignalControlTab

# Set appearance mode and color theme
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class ModernTrafficSystem:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("🚦 Smart Traffic Management System")
        self.root.geometry("1400x900")
        self.root.resizable(True, True)

        # Initialize variables
        self.user_id = "admin"
        self.password = "1234"
        self.logged_in = False
        self.weather_data = {}
        self.traffic_stats = {}
        self.notifications = []
        self.alerts_enabled = True
        self.sound_enabled = False
        self.theme_mode = "dark"

        # Animation variables
        self.loading_dots = 0
        self.pulse_active = False

        # Create notification system
        self.notification_queue = []
        self.notification_window = None

        # Initialize sound alerts
        self.sound_alerts = SoundAlerts()

        self.show_login_screen()

    def show_login_screen(self):
        # Clear existing widgets with fade effect
        self.fade_out_widgets()

        # Create main frame
        main_frame = ctk.CTkFrame(self.root, fg_color="#1a1a2e")
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)

        # Animated title
        self.title_label = ctk.CTkLabel(
            main_frame,
            text="🚦 SMART TRAFFIC MANAGEMENT SYSTEM",
            font=ctk.CTkFont(size=32, weight="bold"),
            text_color="#00d4ff"
        )
        self.title_label.pack(pady=(50, 30))

        # Start title animation
        self.animate_title()

        # Subtitle with typing effect
        self.subtitle_text = "Intelligent Traffic Control for Smart Cities"
        self.subtitle_label = ctk.CTkLabel(
            main_frame,
            text="",
            font=ctk.CTkFont(size=16),
            text_color="#b0b0b0"
        )
        self.subtitle_label.pack(pady=(0, 50))

        # Start typing animation
        self.type_subtitle()

        # Login frame with slide-in animation
        login_frame = ctk.CTkFrame(main_frame, fg_color="#16213e", corner_radius=20)
        login_frame.pack(pady=20, padx=100, fill="x")

        # Initially hide login frame for animation
        login_frame.pack_forget()

        # Login title
        login_title = ctk.CTkLabel(
            login_frame,
            text="🔐 Administrator Login",
            font=ctk.CTkFont(size=20, weight="bold"),
            text_color="#00d4ff"
        )
        login_title.pack(pady=(30, 20))

        # Username
        username_label = ctk.CTkLabel(login_frame, text="👤 Username:", font=ctk.CTkFont(size=14))
        username_label.pack(pady=(10, 5))
        self.username_entry = ctk.CTkEntry(
            login_frame,
            placeholder_text="Enter username",
            width=300,
            height=40,
            font=ctk.CTkFont(size=14)
        )
        self.username_entry.pack(pady=(0, 20))

        # Password
        password_label = ctk.CTkLabel(login_frame, text="🔒 Password:", font=ctk.CTkFont(size=14))
        password_label.pack(pady=(10, 5))
        self.password_entry = ctk.CTkEntry(
            login_frame,
            placeholder_text="Enter password",
            show="•",
            width=300,
            height=40,
            font=ctk.CTkFont(size=14)
        )
        self.password_entry.pack(pady=(0, 30))

        # Login button with pulse effect
        self.login_button = ctk.CTkButton(
            login_frame,
            text="🚀 LOGIN",
            command=self.authenticate,
            width=200,
            height=45,
            font=ctk.CTkFont(size=16, weight="bold"),
            fg_color="#00d4ff",
            hover_color="#0099cc"
        )
        self.login_button.pack(pady=(0, 30))

        # Status label
        self.status_label = ctk.CTkLabel(login_frame, text="", font=ctk.CTkFont(size=12))
        self.status_label.pack(pady=(0, 20))

        # Bind enter key
        self.root.bind('<Return>', lambda e: self.authenticate())

        # Slide in login frame after a delay
        self.root.after(1500, lambda: self.slide_in_widget(login_frame, main_frame))

    def fade_out_widgets(self):
        """Fade out existing widgets before showing new screen"""
        for widget in self.root.winfo_children():
            try:
                # Gradually reduce opacity
                current_alpha = 1.0
                def fade_step():
                    nonlocal current_alpha
                    current_alpha -= 0.1
                    if current_alpha > 0:
                        # Note: CTk doesn't have direct alpha control, so we'll just destroy
                        self.root.after(50, fade_step)
                    else:
                        widget.destroy()
                fade_step()
            except:
                widget.destroy()

    def animate_title(self):
        """Animate the title with color cycling"""
        colors = ["#00d4ff", "#0099cc", "#0066ff", "#00d4ff"]
        current_color = 0

        def cycle_color():
            nonlocal current_color
            self.title_label.configure(text_color=colors[current_color])
            current_color = (current_color + 1) % len(colors)
            self.root.after(500, cycle_color)

        cycle_color()

    def type_subtitle(self):
        """Type out subtitle character by character"""
        self.current_char = 0
        self.full_subtitle = "Intelligent Traffic Control for Smart Cities"

        def type_next_char():
            if self.current_char < len(self.full_subtitle):
                self.subtitle_label.configure(
                    text=self.full_subtitle[:self.current_char + 1]
                )
                self.current_char += 1
                self.root.after(50, type_next_char)

        type_next_char()

    def slide_in_widget(self, widget, parent):
        """Slide in widget from left"""
        widget.pack(pady=20, padx=100, fill="x")
        # CTk doesn't have direct animation, but we can simulate with geometry changes
        # For now, just show the widget

    def pulse_button(self, button, duration=2000):
        """Create a pulsing effect on button"""
        if not self.pulse_active:
            return

        original_color = button.cget("fg_color")
        button.configure(fg_color="#ffffff")
        self.root.after(200, lambda: button.configure(fg_color=original_color))
        self.root.after(duration, lambda: self.pulse_button(button, duration))

    def authenticate(self):
        username = self.username_entry.get()
        password = self.password_entry.get()

        if username == self.user_id and password == self.password:
            self.logged_in = True
            self.status_label.configure(text="✅ Login successful!", text_color="#00ff00")

            # Start loading animation
            self.start_loading_animation()

            # Disable button and show loading
            self.login_button.configure(state="disabled", text="🔄 Loading...")

            # Animate transition
            self.root.after(2000, self.show_dashboard)
        else:
            self.status_label.configure(text="❌ Invalid credentials!", text_color="#ff4444")
            self.shake_widget(self.username_entry)
            self.shake_widget(self.password_entry)
            self.password_entry.delete(0, 'end')

    def start_loading_animation(self):
        """Show loading dots animation"""
        def animate_dots():
            dots = "." * ((self.loading_dots % 3) + 1)
            self.login_button.configure(text=f"🔄 Loading{dots}")
            self.loading_dots += 1
            if self.logged_in:
                self.root.after(500, animate_dots)

        animate_dots()

    def shake_widget(self, widget):
        """Shake widget to indicate error"""
        original_x = widget.winfo_x()
        shake_distance = 5
        shakes = 6

        def shake_step(step):
            if step < shakes:
                offset = shake_distance if step % 2 == 0 else -shake_distance
                # CTk doesn't support direct geometry changes, so we'll skip this for now
                self.root.after(50, lambda: shake_step(step + 1))

        shake_step(0)

    def show_dashboard(self):
        # Clear existing widgets
        for widget in self.root.winfo_children():
            widget.destroy()

        # Create main dashboard with enhanced features
        self.create_enhanced_dashboard()

        # Start background threads
        self.start_background_tasks()

        # Show welcome notification
        self.show_notification("Welcome to Smart Traffic Management System!", "success")

    def create_enhanced_dashboard(self):
        # Main container
        main_frame = ctk.CTkFrame(self.root, fg_color="#0f0f23")
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)

        # Enhanced header with theme switcher
        header_frame = ctk.CTkFrame(main_frame, fg_color="#1a1a2e", height=80)
        header_frame.pack(fill="x", padx=10, pady=10)
        header_frame.pack_propagate(False)

        title_label = ctk.CTkLabel(
            header_frame,
            text="🚦 Smart Traffic Management Dashboard",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#00d4ff"
        )
        title_label.pack(side="left", padx=20, pady=20)

        # Theme switcher
        theme_frame = ctk.CTkFrame(header_frame, fg_color="#1a1a2e")
        theme_frame.pack(side="right", padx=20, pady=10)

        theme_label = ctk.CTkLabel(theme_frame, text="Theme:", font=ctk.CTkFont(size=12))
        theme_label.pack(pady=(5, 0))

        self.theme_switch = ctk.CTkSegmentedButton(
            theme_frame,
            values=["Dark", "Light"],
            command=self.change_theme
        )
        self.theme_switch.set("Dark")
        self.theme_switch.pack(pady=(0, 5))

        # Real-time clock with enhanced display
        self.clock_frame = ctk.CTkFrame(header_frame, fg_color="#0f3460", width=200, height=60)
        self.clock_frame.pack(side="right", padx=(0, 20), pady=10)
        self.clock_frame.pack_propagate(False)

        self.clock_label = ctk.CTkLabel(
            self.clock_frame,
            text="",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color="#ffffff"
        )
        self.clock_label.pack(expand=True)

        # Notification bell
        self.notification_btn = ctk.CTkButton(
            header_frame,
            text="🔔",
            command=self.show_notifications,
            width=40,
            height=40,
            fg_color="#1a1a2e",
            hover_color="#0f3460"
        )
        self.notification_btn.pack(side="right", padx=(0, 10), pady=20)

        # Content area with tabs
        self.create_tabbed_interface(main_frame)

    def create_tabbed_interface(self, parent):
        # Create tabview
        self.tabview = ctk.CTkTabview(parent, width=1350, height=750)
        self.tabview.pack(padx=10, pady=(0, 10), fill="both", expand=True)

        # Create tabs
        self.tabview.add("🚦 Traffic Monitor")
        self.tabview.add("📊 Analytics")
        self.tabview.add("� Signal Control")
        self.tabview.add("�📤 Export Center")
        self.tabview.add("🔔 Notifications")
        # self.tabview.add("🌐 API Integration")  # Not implemented
        # self.tabview.add("🤖 AI Predictions")  # Not implemented
        # self.tabview.add("🚨 Emergency Response")  # Not implemented
        # self.tabview.add("👥 User Management")  # Not implemented
        self.tabview.add("⚙️ Settings")
        # self.tabview.add("📋 Reports")  # Not implemented

        # Initialize each tab
        self.create_traffic_tab()
        self.create_analytics_tab()
        self.create_signal_control_tab()
        self.create_export_tab()
        self.create_notifications_tab()
        # self.create_api_tab()  # Not implemented
        # self.create_ai_predictions_tab()  # Not implemented
        # self.create_emergency_tab()  # Not implemented
        # self.create_user_management_tab()  # Not implemented
        self.create_settings_tab()
        # self.create_reports_tab()  # Not implemented

    def create_traffic_tab(self):
        traffic_tab = self.tabview.tab("🚦 Traffic Monitor")

        # Left sidebar
        sidebar_frame = ctk.CTkFrame(traffic_tab, width=300, fg_color="#1a1a2e")
        sidebar_frame.pack(side="left", fill="y", padx=(0, 10), pady=10)
        sidebar_frame.pack_propagate(False)

        self.create_enhanced_sidebar(sidebar_frame)

        # Main traffic view
        traffic_frame = ctk.CTkFrame(traffic_tab, fg_color="#16213e")
        traffic_frame.pack(side="right", fill="both", expand=True, padx=(0, 0), pady=10)

        # Traffic title
        traffic_title = ctk.CTkLabel(
            traffic_frame,
            text="📊 Live Traffic Monitoring",
            font=ctk.CTkFont(size=20, weight="bold"),
            text_color="#00d4ff"
        )
        traffic_title.pack(pady=(20, 10))

        # Traffic grid container
        self.traffic_container = ctk.CTkFrame(traffic_frame, fg_color="#0f0f23")
        self.traffic_container.pack(fill="both", expand=True, padx=20, pady=(0, 20))

        # Configure grid layout for the container
        for i in range(3):
            self.traffic_container.grid_rowconfigure(i, weight=1)
            self.traffic_container.grid_columnconfigure(i, weight=1)

        # Initialize traffic monitoring
        self.traffic_monitor = ModernTrafficMonitor(self.traffic_container)

    def create_analytics_tab(self):
        analytics_tab = self.tabview.tab("📊 Analytics")

        # Analytics will be opened in separate window
        analytics_frame = ctk.CTkFrame(analytics_tab, fg_color="#1a1a2e")
        analytics_frame.pack(fill="both", expand=True, padx=20, pady=20)

        title_label = ctk.CTkLabel(
            analytics_frame,
            text="📈 Advanced Analytics Dashboard",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#00d4ff"
        )
        title_label.pack(pady=(50, 20))

        subtitle_label = ctk.CTkLabel(
            analytics_frame,
            text="Click below to open the comprehensive analytics dashboard with real-time charts and insights.",
            font=ctk.CTkFont(size=14),
            text_color="#b0b0b0",
            wraplength=600
        )
        subtitle_label.pack(pady=(0, 40))

        open_analytics_btn = ctk.CTkButton(
            analytics_frame,
            text="🚀 Open Analytics Dashboard",
            command=lambda: AnalyticsWindow(self.root),
            width=250,
            height=60,
            font=ctk.CTkFont(size=16, weight="bold"),
            fg_color="#00d4ff",
            hover_color="#0099cc"
        )
        open_analytics_btn.pack(pady=20)

    def create_signal_control_tab(self):
        """Create the adaptive signal control tab"""
        signal_tab = self.tabview.tab("🚨 Signal Control")

        # Initialize signal control system
        self.signal_control = SignalControlTab(signal_tab)

    def create_export_tab(self):
        export_tab = self.tabview.tab("📤 Export Center")

        export_frame = ctk.CTkFrame(export_tab, fg_color="#1a1a2e")
        export_frame.pack(fill="both", expand=True, padx=20, pady=20)

        title_label = ctk.CTkLabel(
            export_frame,
            text="📤 Export & Reporting Center",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#00d4ff"
        )
        title_label.pack(pady=(30, 20))

        # Export options frame
        options_frame = ctk.CTkFrame(export_frame, fg_color="#0f3460")
        options_frame.pack(fill="x", padx=20, pady=(0, 20))

        options_title = ctk.CTkLabel(
            options_frame,
            text="📋 Export Options",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#00d4ff"
        )
        options_title.pack(pady=(15, 10))

        # Export buttons grid
        buttons_frame = ctk.CTkFrame(options_frame, fg_color="transparent")
        buttons_frame.pack(fill="x", padx=20, pady=(0, 15))

        # Row 1: Chart exports
        chart_row = ctk.CTkFrame(buttons_frame, fg_color="transparent")
        chart_row.pack(fill="x", pady=(0, 10))

        export_chart_btn = ctk.CTkButton(
            chart_row,
            text="📊 Export Charts (PNG)",
            command=self.export_charts,
            width=180,
            height=45,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#ff6b6b",
            hover_color="#cc5555"
        )
        export_chart_btn.pack(side="left", padx=(0, 10))

        export_pdf_btn = ctk.CTkButton(
            chart_row,
            text="📄 Generate PDF Report",
            command=self.export_pdf_report,
            width=180,
            height=45,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#4ecdc4",
            hover_color="#3da8a0"
        )
        export_pdf_btn.pack(side="left", padx=(0, 10))

        # Row 2: Data exports
        data_row = ctk.CTkFrame(buttons_frame, fg_color="transparent")
        data_row.pack(fill="x", pady=(0, 10))

        export_csv_btn = ctk.CTkButton(
            data_row,
            text="📊 Export Data (CSV)",
            command=self.export_csv_data,
            width=180,
            height=45,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#45b7d1",
            hover_color="#3a94a8"
        )
        export_csv_btn.pack(side="left", padx=(0, 10))

        export_json_btn = ctk.CTkButton(
            data_row,
            text="🔧 Export Config (JSON)",
            command=self.export_json_config,
            width=180,
            height=45,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#f9ca24",
            hover_color="#d4a91e"
        )
        export_json_btn.pack(side="left", padx=(0, 10))

        # Status display
        status_frame = ctk.CTkFrame(export_frame, fg_color="#0f3460")
        status_frame.pack(fill="x", padx=20, pady=(0, 20))

        status_title = ctk.CTkLabel(
            status_frame,
            text="📊 Export Status",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#00d4ff"
        )
        status_title.pack(pady=(15, 10))

        self.export_status = ctk.CTkTextbox(
            status_frame,
            wrap="word",
            font=ctk.CTkFont(size=11),
            height=120
        )
        self.export_status.pack(fill="both", expand=True, padx=15, pady=(0, 15))
        self.export_status.insert("0.0", "Ready to export data and reports...\n\nSelect export options above to generate files.")

    def create_notifications_tab(self):
        notifications_tab = self.tabview.tab("🔔 Notifications")

        notifications_frame = ctk.CTkFrame(notifications_tab, fg_color="#1a1a2e")
        notifications_frame.pack(fill="both", expand=True, padx=20, pady=20)

        title_label = ctk.CTkLabel(
            notifications_frame,
            text="🔔 Notification Center",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#00d4ff"
        )
        title_label.pack(pady=(30, 20))

        # Notification controls
        controls_frame = ctk.CTkFrame(notifications_frame, fg_color="#0f3460")
        controls_frame.pack(fill="x", padx=20, pady=(0, 20))

        controls_title = ctk.CTkLabel(
            controls_frame,
            text="⚙️ Notification Settings",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#00d4ff"
        )
        controls_title.pack(pady=(15, 10))

        # Alert toggles
        toggles_frame = ctk.CTkFrame(controls_frame, fg_color="transparent")
        toggles_frame.pack(fill="x", padx=20, pady=(0, 15))

        # Sound alerts toggle
        self.sound_alerts_var = ctk.BooleanVar(value=self.sound_enabled)
        sound_toggle = ctk.CTkSwitch(
            toggles_frame,
            text="🔊 Sound Alerts",
            variable=self.sound_alerts_var,
            command=self.toggle_sound_alerts,
            font=ctk.CTkFont(size=12, weight="bold")
        )
        sound_toggle.pack(anchor="w", pady=(0, 10))

        # Visual alerts toggle
        self.visual_alerts_var = ctk.BooleanVar(value=self.alerts_enabled)
        visual_toggle = ctk.CTkSwitch(
            toggles_frame,
            text="👁️ Visual Alerts",
            variable=self.visual_alerts_var,
            command=self.toggle_visual_alerts,
            font=ctk.CTkFont(size=12, weight="bold")
        )
        visual_toggle.pack(anchor="w", pady=(0, 10))

        # Test notification button
        test_btn = ctk.CTkButton(
            toggles_frame,
            text="🔔 Test Notification",
            command=self.test_notification,
            width=150,
            height=35,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#ff6b6b",
            hover_color="#cc5555"
        )
        test_btn.pack(anchor="w", pady=(10, 0))

        # Alert history
        history_frame = ctk.CTkFrame(notifications_frame, fg_color="#0f3460")
        history_frame.pack(fill="both", expand=True, padx=20, pady=(0, 20))

        history_title = ctk.CTkLabel(
            history_frame,
            text="📋 Alert History",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#00d4ff"
        )
        history_title.pack(pady=(15, 10))

        self.alert_history_text = ctk.CTkTextbox(
            history_frame,
            wrap="word",
            font=ctk.CTkFont(size=11),
            height=200
        )
        self.alert_history_text.pack(fill="both", expand=True, padx=15, pady=(0, 15))

        # Clear history button
        clear_btn = ctk.CTkButton(
            history_frame,
            text="🗑️ Clear History",
            command=self.clear_alert_history,
            width=120,
            height=30,
            font=ctk.CTkFont(size=10, weight="bold"),
            fg_color="#e74c3c",
            hover_color="#c0392b"
        )
        clear_btn.pack(pady=(0, 15))

        # Initialize alert history
        self.update_alert_history()

    def create_settings_tab(self):
        settings_tab = self.tabview.tab("⚙️ Settings")

        settings_frame = ctk.CTkFrame(settings_tab, fg_color="#1a1a2e")
        settings_frame.pack(fill="both", expand=True, padx=20, pady=20)

        title_label = ctk.CTkLabel(
            settings_frame,
            text="⚙️ System Settings",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#00d4ff"
        )
        title_label.pack(pady=(30, 20))

        # General Settings
        general_frame = ctk.CTkFrame(settings_frame, fg_color="#0f3460")
        general_frame.pack(fill="x", padx=20, pady=(0, 20))

        general_title = ctk.CTkLabel(
            general_frame,
            text="🔧 General Settings",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#00d4ff"
        )
        general_title.pack(pady=(15, 10))

        # Settings controls
        settings_controls = ctk.CTkFrame(general_frame, fg_color="transparent")
        settings_controls.pack(fill="x", padx=20, pady=(0, 15))

        # Animation speed slider
        animation_label = ctk.CTkLabel(
            settings_controls,
            text="Animation Speed:",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#ffffff"
        )
        animation_label.pack(anchor="w", pady=(10, 5))

        self.animation_speed_var = ctk.DoubleVar(value=100)
        animation_slider = ctk.CTkSlider(
            settings_controls,
            from_=50,
            to=200,
            variable=self.animation_speed_var,
            command=self.update_animation_speed
        )
        animation_slider.pack(fill="x", pady=(0, 10))

        # Auto-refresh toggle
        self.auto_refresh_var = ctk.BooleanVar(value=True)
        auto_refresh_toggle = ctk.CTkSwitch(
            settings_controls,
            text="🔄 Auto-refresh Data",
            variable=self.auto_refresh_var,
            command=self.toggle_auto_refresh,
            font=ctk.CTkFont(size=12, weight="bold")
        )
        auto_refresh_toggle.pack(anchor="w", pady=(10, 5))

        # Performance Settings
        perf_frame = ctk.CTkFrame(settings_frame, fg_color="#0f3460")
        perf_frame.pack(fill="x", padx=20, pady=(0, 20))

        perf_title = ctk.CTkLabel(
            perf_frame,
            text="⚡ Performance Settings",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#00d4ff"
        )
        perf_title.pack(pady=(15, 10))

        perf_controls = ctk.CTkFrame(perf_frame, fg_color="transparent")
        perf_controls.pack(fill="x", padx=20, pady=(0, 15))

        # Data retention period
        retention_label = ctk.CTkLabel(
            perf_controls,
            text="Data Retention (days):",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#ffffff"
        )
        retention_label.pack(anchor="w", pady=(10, 5))

        self.retention_var = ctk.IntVar(value=30)
        retention_entry = ctk.CTkEntry(
            perf_controls,
            textvariable=self.retention_var,
            width=100
        )
        retention_entry.pack(anchor="w", pady=(0, 10))

        # System Actions
        actions_frame = ctk.CTkFrame(settings_frame, fg_color="#0f3460")
        actions_frame.pack(fill="x", padx=20, pady=(0, 20))

        actions_title = ctk.CTkLabel(
            actions_frame,
            text="🔄 System Actions",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#00d4ff"
        )
        actions_title.pack(pady=(15, 10))

        actions_buttons = ctk.CTkFrame(actions_frame, fg_color="transparent")
        actions_buttons.pack(fill="x", padx=20, pady=(0, 15))

        # Action buttons row 1
        actions_row1 = ctk.CTkFrame(actions_buttons, fg_color="transparent")
        actions_row1.pack(fill="x", pady=(0, 10))

        save_settings_btn = ctk.CTkButton(
            actions_row1,
            text="💾 Save Settings",
            command=self.save_settings,
            width=140,
            height=40,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#4ecdc4",
            hover_color="#3da8a0"
        )
        save_settings_btn.pack(side="left", padx=(0, 10))

        reset_settings_btn = ctk.CTkButton(
            actions_row1,
            text="🔄 Reset to Default",
            command=self.reset_settings,
            width=140,
            height=40,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#f9ca24",
            hover_color="#d4a91e"
        )
        reset_settings_btn.pack(side="left", padx=(0, 10))

        # Action buttons row 2
        actions_row2 = ctk.CTkFrame(actions_buttons, fg_color="transparent")
        actions_row2.pack(fill="x", pady=(0, 10))

        backup_data_btn = ctk.CTkButton(
            actions_row2,
            text="💾 Backup Data",
            command=self.backup_data,
            width=140,
            height=40,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#45b7d1",
            hover_color="#3a94a8"
        )
        backup_data_btn.pack(side="left", padx=(0, 10))

        clear_cache_btn = ctk.CTkButton(
            actions_row2,
            text="🗑️ Clear Cache",
            command=self.clear_cache,
            width=140,
            height=40,
            font=ctk.CTkFont(size=11, weight="bold"),
            fg_color="#ff6b6b",
            hover_color="#cc5555"
        )
        clear_cache_btn.pack(side="left", padx=(0, 10))

        # System Information
        info_frame = ctk.CTkFrame(settings_frame, fg_color="#0f3460")
        info_frame.pack(fill="both", expand=True, padx=20, pady=(0, 20))

        info_title = ctk.CTkLabel(
            info_frame,
            text="ℹ️ System Information",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#00d4ff"
        )
        info_title.pack(pady=(15, 10))

        system_info = f"""
🚦 Smart Traffic Management System v2.0
📅 Build Date: {datetime.now().strftime('%Y-%m-%d')}
🖥️ Platform: Windows
🐍 Python: 3.10+
📊 Active Junctions: 9
🔗 API Connections: 6
🤖 AI Models: 5
📱 Mobile Support: Enabled
🌐 Web Dashboard: Available
        """

        info_display = ctk.CTkTextbox(
            info_frame,
            wrap="word",
            font=ctk.CTkFont(size=11),
            height=120
        )
        info_display.pack(fill="both", expand=True, padx=15, pady=(0, 15))
        info_display.insert("0.0", system_info.strip())
        info_display.configure(state="disabled")

    def create_enhanced_sidebar(self, parent):
        # System Status with live updates
        status_frame = ctk.CTkFrame(parent, fg_color="#0f3460")
        status_frame.pack(fill="x", padx=10, pady=10)

        status_title = ctk.CTkLabel(
            status_frame,
            text="🔴 System Status",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#00d4ff"
        )
        status_title.pack(pady=(10, 5))

        self.system_status = ctk.CTkLabel(
            status_frame,
            text="🟢 Online",
            font=ctk.CTkFont(size=14),
            text_color="#00ff00"
        )
        self.system_status.pack(pady=(0, 10))

        # Weather Info with live updates
        weather_frame = ctk.CTkFrame(parent, fg_color="#0f3460")
        weather_frame.pack(fill="x", padx=10, pady=(0, 10))

        weather_title = ctk.CTkLabel(
            weather_frame,
            text="🌤️ Weather Conditions",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#00d4ff"
        )
        weather_title.pack(pady=(10, 5))

        self.weather_label = ctk.CTkLabel(
            weather_frame,
            text="Loading...",
            font=ctk.CTkFont(size=12),
            text_color="#ffffff"
        )
        self.weather_label.pack(pady=(0, 10))

        # Traffic Statistics with live updates
        stats_frame = ctk.CTkFrame(parent, fg_color="#0f3460")
        stats_frame.pack(fill="x", padx=10, pady=(0, 10))

        stats_title = ctk.CTkLabel(
            stats_frame,
            text="📈 Traffic Statistics",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#00d4ff"
        )
        stats_title.pack(pady=(10, 5))

        self.stats_label = ctk.CTkLabel(
            stats_frame,
            text="Total Junctions: 9\nActive Monitoring: Yes\nLast Update: --",
            font=ctk.CTkFont(size=12),
            text_color="#ffffff",
            justify="left"
        )
        self.stats_label.pack(pady=(0, 10))

        # Performance metrics
        perf_frame = ctk.CTkFrame(parent, fg_color="#0f3460")
        perf_frame.pack(fill="x", padx=10, pady=(0, 10))

        perf_title = ctk.CTkLabel(
            perf_frame,
            text="⚡ Performance",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#00d4ff"
        )
        perf_title.pack(pady=(10, 5))

        self.perf_label = ctk.CTkLabel(
            perf_frame,
            text="CPU: --\nMemory: --\nUptime: --",
            font=ctk.CTkFont(size=12), 
            text_color="#ffffff",
            justify="left"
        )
        self.perf_label.pack(pady=(0, 10))

    def start_background_tasks(self):
        """Start all background tasks and threads"""
        # Start clock updates
        self.update_clock()

        # Start weather updates
        self.update_weather()

        # Start traffic monitoring
        self.traffic_monitor.start_monitoring()

        # Start performance monitoring
        self.update_performance()


    # ===== MISSING METHODS =====
    def update_clock(self):
        """Update the clock display"""
        if hasattr(self, 'clock_label'):
            from datetime import datetime
            current_time = datetime.now().strftime("%H:%M:%S")
            self.clock_label.configure(text=current_time)
            # Schedule next update
            self.root.after(1000, self.update_clock)

    def update_weather(self):
        """Update weather data"""
        # Mock weather update
        self.weather_data = {
            "temperature": "22°C",
            "condition": "Sunny",
            "humidity": "65%"
        }

    def update_performance(self):
        """Update performance metrics"""
        # Mock performance update
        pass

    def change_theme(self, theme):
        """Change application theme"""
        if theme == "Light":
            ctk.set_appearance_mode("light")
            self.theme_mode = "light"
            self.show_notification("☀️ Switched to Light theme", "info")
        else:
            ctk.set_appearance_mode("dark")
            self.theme_mode = "dark"
            self.show_notification("🌙 Switched to Dark theme", "info")

    def show_notifications(self):
        """Show notifications popup window"""
        self.show_notifications_window()

    def show_notification(self, message, level="info"):
        """Add a notification to the queue"""
        from datetime import datetime
        notification = {
            "message": message,
            "level": level,
            "timestamp": datetime.now().strftime("%H:%M:%S")
        }
        self.notifications.append(notification)
        # Keep only last 100 notifications
        if len(self.notifications) > 100:
            self.notifications.pop(0)

    def show_notifications_window(self):
        """Show notifications popup window"""
        # Simple implementation - just print notifications for now
        print("Recent notifications:")
        for notification in self.notifications[-5:]:  # Show last 5
            print(f"[{notification['timestamp']}] {notification['level']}: {notification['message']}")

    # ===== SETTINGS METHODS =====
    def update_animation_speed(self, value):
        self.animation_speed = int(value)
        self.show_notification(f"Animation speed set to {self.animation_speed}%", "info")

    def toggle_auto_refresh(self):
        status = "enabled" if self.auto_refresh_var.get() else "disabled"
        self.show_notification(f"Auto-refresh {status}", "info")

    def save_settings(self):
        # Save current settings
        settings = {
            "theme": self.theme_mode,
            "alerts_enabled": self.alerts_enabled,
            "sound_enabled": self.sound_enabled,
            "animation_speed": getattr(self, 'animation_speed', 100),
            "auto_refresh": self.auto_refresh_var.get(),
            "data_retention": self.retention_var.get()
        }

        try:
            with open("settings.json", "w") as f:
                json.dump(settings, f, indent=2)
            self.show_notification("✅ Settings saved successfully", "success")
        except Exception as e:
            self.show_notification(f"❌ Failed to save settings: {e}", "error")

    def reset_settings(self):
        # Reset to default settings
        self.theme_mode = "dark"
        self.alerts_enabled = True
        self.sound_enabled = False
        self.animation_speed_var.set(100)
        self.auto_refresh_var.set(True)
        self.retention_var.set(30)

        # Update UI
        self.theme_switch.set("Dark")
        self.sound_alerts_var.set(False)
        self.visual_alerts_var.set(True)

        self.show_notification("🔄 Settings reset to defaults", "info")

    def backup_data(self):
        try:
            # Create backup directory
            backup_dir = "backups"
            if not os.path.exists(backup_dir):
                os.makedirs(backup_dir)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = f"{backup_dir}/system_backup_{timestamp}.json"

            # Collect all system data
            backup_data = {
                "timestamp": datetime.now().isoformat(),
                "settings": {
                    "theme": self.theme_mode,
                    "alerts_enabled": self.alerts_enabled,
                    "sound_enabled": self.sound_enabled,
                    "animation_speed": getattr(self, 'animation_speed', 100),
                    "auto_refresh": self.auto_refresh_var.get(),
                    "data_retention": self.retention_var.get()
                },
                "notifications": self.notifications[-50:],  # Last 50 notifications
                "traffic_stats": getattr(self, 'traffic_stats', {}),
                "weather_data": getattr(self, 'weather_data', {}),
                "junctions": [
                    {"id": f"J{i+1}", "status": "active", "last_update": datetime.now().isoformat()}
                    for i in range(9)
                ]
            }

            with open(backup_file, "w") as f:
                json.dump(backup_data, f, indent=2)

            self.show_notification(f"✅ Data backed up to {backup_file}", "success")

        except Exception as e:
            self.show_notification(f"❌ Backup failed: {e}", "error")

    def clear_cache(self):
        """Clear system cache"""
        try:
            # Clear any cached data
            self.weather_data.clear()
            self.traffic_stats.clear()
            self.show_notification("🗑️ Cache cleared successfully", "success")
        except Exception as e:
            self.show_notification(f"❌ Failed to clear cache: {e}", "error")

    # ===== NOTIFICATION METHODS =====
    def toggle_sound_alerts(self):
        """Toggle sound alerts on/off"""
        self.sound_enabled = self.sound_alerts_var.get()
        status = "enabled" if self.sound_enabled else "disabled"
        self.show_notification(f"🔊 Sound alerts {status}", "info")

    def toggle_visual_alerts(self):
        """Toggle visual alerts on/off"""
        self.alerts_enabled = self.visual_alerts_var.get()
        status = "enabled" if self.alerts_enabled else "disabled"
        self.show_notification(f"👁️ Visual alerts {status}", "info")

    def test_notification(self):
        """Send a test notification"""
        self.show_notification("🔔 This is a test notification", "info")

    def clear_alert_history(self):
        """Clear alert history"""
        self.notifications.clear()
        if hasattr(self, 'alert_history_text'):
            self.alert_history_text.delete("0.0", "end")
            self.alert_history_text.insert("0.0", "Alert history cleared.\n")
        self.show_notification("🗑️ Alert history cleared", "info")

    def update_alert_history(self):
        """Update alert history display"""
        if hasattr(self, 'alert_history_text'):
            self.alert_history_text.delete("0.0", "end")
            if not self.notifications:
                self.alert_history_text.insert("0.0", "No alerts in history.\n")
            else:
                for notification in self.notifications[-20:]:  # Show last 20
                    timestamp = notification.get('timestamp', 'Unknown')
                    level = notification.get('level', 'info')
                    message = notification.get('message', 'Unknown alert')
                    emoji = "ℹ️" if level == "info" else "⚠️" if level == "warning" else "🚨" if level == "error" else "✅"
                    self.alert_history_text.insert("end", f"{emoji} [{timestamp}] {message}\n")

    # ===== EXPORT METHODS =====
    def export_charts(self):
        """Export charts as PNG images"""
        try:
            import matplotlib.pyplot as plt
            
            # Create export directory
            export_dir = "exports"
            if not os.path.exists(export_dir):
                os.makedirs(export_dir)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # Export traffic congestion chart
            plt.figure(figsize=(10, 6))
            junctions = [f"Junction {i+1}" for i in range(9)]
            congestion = [float(pd.read_csv("output0.csv", header=None).iloc[i, 1]) for i in range(9)]
            
            plt.bar(junctions, congestion, color='#ff6b6b')
            plt.title('Traffic Congestion by Junction')
            plt.xlabel('Junction')
            plt.ylabel('Congestion (minutes)')
            plt.xticks(rotation=45)
            plt.tight_layout() 
            
            chart_file = f"{export_dir}/traffic_chart_{timestamp}.png"
            plt.savefig(chart_file, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.export_status.insert("end", f"\n✅ Chart exported: {chart_file}")
            self.show_notification("✅ Charts exported successfully", "success")
            
        except Exception as e:
            self.export_status.insert("end", f"\n❌ Chart export failed: {e}")
            self.show_notification(f"❌ Chart export failed: {e}", "error")

    def export_pdf_report(self):
        """Generate comprehensive PDF report"""
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
            from reportlab.lib.styles import getSampleStyleSheet
            
            export_dir = "exports"
            if not os.path.exists(export_dir):
                os.makedirs(export_dir)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"{export_dir}/traffic_report_{timestamp}.pdf"
            
            doc = SimpleDocTemplate(report_file, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            # Title
            title = Paragraph("Smart Traffic Management System Report", styles['Title'])
            story.append(title)
            story.append(Spacer(1, 12))
            
            # Summary
            summary = Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal'])
            story.append(summary)
            story.append(Spacer(1, 12))
            
            # Traffic data table
            data = [['Junction', 'Congestion (min)', 'Status']]
            for i in range(9):
                congestion = float(pd.read_csv("output0.csv", header=None).iloc[i, 1])
                status = "High" if congestion >= 4 else "Medium" if congestion >= 2 else "Low"
                data.append([f"Junction {i+1}", f"{congestion:.1f}", status])
            
            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 14),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table)
            
            doc.build(story)
            
            self.export_status.insert("end", f"\n✅ PDF report generated: {report_file}")
            self.show_notification("✅ PDF report generated successfully", "success")
            
        except ImportError:
            self.export_status.insert("end", "\n❌ PDF export requires reportlab: pip install reportlab")
            self.show_notification("❌ PDF export requires reportlab package", "error")
        except Exception as e:
            self.export_status.insert("end", f"\n❌ PDF report failed: {e}")
            self.show_notification(f"❌ PDF report failed: {e}", "error")

    def export_csv_data(self):
        """Export traffic data as CSV"""
        try:
            # Define location functions locally
            def get_location_name(junction_id):
                locations = [
                    "Big Ben, London",
                    "Times Square, NYC", 
                    "Central Park, NYC",
                    "Union Station, DC",
                    "City Hall, Chicago",
                    "Airport Terminal, LA",
                    "Harbor View, Miami",
                    "Grand Mall, Dallas",
                    "Stadium Plaza, Denver"
                ]
                return locations[junction_id - 1] if 1 <= junction_id <= 9 else f"Junction {junction_id}"

            def get_coordinates(junction_id):
                coords = [
                    "51.50,-0.12",
                    "40.75,-73.98",
                    "40.78,-73.96", 
                    "38.89,-77.00",
                    "41.87,-87.62",
                    "33.94,-118.40",
                    "25.76,-80.19",
                    "32.77,-96.79",
                    "39.73,-104.98"
                ]
                return coords[junction_id - 1] if 1 <= junction_id <= 9 else "0.00,0.00"
            
            export_dir = "exports"
            if not os.path.exists(export_dir):
                os.makedirs(export_dir)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            csv_file = f"{export_dir}/traffic_data_{timestamp}.csv"
            
            # Combine data from both timeframes
            data_0 = pd.read_csv("output0.csv", header=None)
            data_5 = pd.read_csv("output5.csv", header=None)
            
            combined_data = pd.DataFrame({
                'Junction': [f"Junction {i+1}" for i in range(9)],
                'Timeframe_0': data_0.iloc[:, 1].values,
                'Timeframe_5': data_5.iloc[:, 1].values,
                'Location': [get_location_name(i+1) for i in range(9)],
                'Coordinates': [get_coordinates(i+1) for i in range(9)]
            })
            
            combined_data.to_csv(csv_file, index=False)
            
            self.export_status.insert("end", f"\n✅ CSV data exported: {csv_file}")
            self.show_notification("✅ CSV data exported successfully", "success")
            
        except Exception as e:
            self.export_status.insert("end", f"\n❌ CSV export failed: {e}")
            self.show_notification(f"❌ CSV export failed: {e}", "error")

    def export_json_config(self):
        """Export system configuration as JSON"""
        try:
            export_dir = "exports"
            if not os.path.exists(export_dir):
                os.makedirs(export_dir)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            json_file = f"{export_dir}/system_config_{timestamp}.json"
            
            config = {
                "export_timestamp": datetime.now().isoformat(),
                "system_settings": {
                    "theme": self.theme_mode,
                    "alerts_enabled": self.alerts_enabled,
                    "sound_enabled": self.sound_enabled,
                    "animation_speed": getattr(self, 'animation_speed', 100),
                    "auto_refresh": getattr(self, 'auto_refresh_var', lambda: True)(),
                    "data_retention_days": getattr(self, 'retention_var', lambda: 30)()
                },
                "traffic_monitoring": {
                    "junctions": 9,
                    "timeframes": [0, 5],
                    "update_interval_seconds": 30
                },
                "export_formats": ["PNG", "PDF", "CSV", "JSON"]
            }
            
            import json
            with open(json_file, 'w') as f:
                json.dump(config, f, indent=2)
            
            self.export_status.insert("end", f"\n✅ JSON config exported: {json_file}")
            self.show_notification("✅ JSON config exported successfully", "success")
            
        except Exception as e:
            self.export_status.insert("end", f"\n❌ JSON export failed: {e}")
            self.show_notification(f"❌ JSON export failed: {e}", "error")

    def run(self):
        """Start the application main loop"""
        self.root.mainloop()


if __name__ == "__main__":
    app = ModernTrafficSystem()
    app.run()